import { EnvironmentOutlined, CreditCardOutlined, PhoneOutlined, GlobalOutlined, LoadingOutlined, SkinOutlined } from '@ant-design/icons';
import { Radio, Space, Spin, Tooltip, Avatar } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { formatNumber } from 'utils';

const getData = (id) => {
  id = "/Rvbxa6ML7D5pVFOvlr1H8joNqm1s5vo95TkfjyPTQxUPcFpz2Kv/MLg"
  return axios
    .post(`${API_BASE}/barnacle/payment_info`, { id })
    .then((res) => res.data)
    .catch(() => false);
};

function Payment() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [order, setOrder] = useState();
  const [method, changeMethod] = useState('momo');

  useEffect(async () => {
    if (router.query.id) {
      const data = await getData(router.query.id);
      setOrder(data);
      setDataLoading(false);
    }
  }, [router.query]);

  const handleClickPayment = () => {
    const url = `${API_BASE}/barnacle/handle_payment`;
    const params = {
      method: method,
      id: order.key,
      amount: order.cod,
    }

    return axios
      .post(url, params)
      .then(res => {
        console.log('res: ', res);

      })
  }

  if (dataLoading)
    return (
      <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
    );

  return (
    <>
      <Head>
        <title>Pancake Payment</title>
        <link rel="icon" href="/logo.png" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {process.env.NODE_ENV === 'production' && process.browser ? (
        <Head>
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-4D7G1SVR9H"
          ></script>
          <script
            async
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag("js", new Date());

                gtag("config", "G-4D7G1SVR9H");`
            }}
          />
        </Head>
      ) : null}
      <div className="payment-container">
        <div className="header-payment">
          <img style={{ width: 99, height: 24 }} src="pancake_logo.svg" />
          <div className="header-title">{'Thanh toán đơn hàng'}</div>
        </div>
        {order && <div className="payment-content">
          <div className='container'>
            <div className='delivery-address'>
              <div className='title'>
                <EnvironmentOutlined style={{ fontSize: 16, marginTop: 2 }} />
                <div className='text'>{'Thông tin nhận hàng'}</div>
              </div>
              <div className='body-text'>
                <div style={{ height: 22, display: 'flex' }}>
                  <div className='name'>{order.bill_full_name}</div>
                  <div className='bulk-head' />
                  <div>{order.bill_phone_number}</div>
                </div>
                <div className='address-text'>
                  {order.address}
                </div>
              </div>
            </div>
          </div>
          <div className='container'>
            <div className='product-info'>
              <div className='title'>
                <img style={{ width: 16, height: 16, marginTop: 2 }} src="/package.svg" />
                <div className='text'>{'Sản phẩm'}</div>
              </div>
              <div className='table-header'>
                <div className='text-header large'>{'Danh sách sản phẩm'}</div>
                <div className='text-header'>{'Đơn giá'}</div>
                <div className='text-header'>{'Số lượng'}</div>
                <div className='text-header'>{'Thành tiền'}</div>
              </div>
              <div>
                {order.items.length > 0 && order.items.map(item => (
                  <div className='item-product'>
                    <div className='text-header large' style={{ display: 'flex' }}>
                      <div style={{ marginTop: 2 }}>
                        {item.images?.length
                          ? <img style={{ width: 40, height: 40 }} src={item.images?.length && item.images[0]} />
                          : <Avatar shape="square" size={40} icon={<SkinOutlined />} />
                        }
                      </div>
                      <div style={{ marginLeft: 12 }}>
                        <div className='attribute-text product-name'>
                          <Tooltip title={item.name}>
                            {item.name}
                          </Tooltip>
                        </div>
                        {item.fields?.length > 0 && <div style={{ height: 20 }}>
                          {item.fields.map((i, idx) => (
                            <>
                              <span className='attribute-text'>{i.name}:</span>
                              <span className='attribute-element'>{i.value}</span>
                              {idx != (item.fields.length - 1) && <span style={{ margin: '0 3px' }}>;</span>}
                            </>
                          ))}
                        </div>}
                      </div>
                    </div>
                    <div className='text-header'>{formatNumber(item.retail_price)}</div>
                    <div className='text-header'>{item.quantity}</div>
                    <div className='text-header'>{formatNumber(item.retail_price * item.quantity)}</div>
                  </div>
                ))}
              </div>
              <div className='table-footer'>
                <div className='footer-element'>
                  <div className='label'>{'Giảm giá'}</div>
                  <div className='value'>{formatNumber(order.total_discount)}</div>
                </div>
                <div className='footer-element'>
                  <div className='label'>{'Phí vận chuyển'}</div>
                  <div className='value'>{formatNumber(order.shipping_fee)}</div>
                </div>
                <div className='footer-element'>
                  <div className='label'>{'Đã thanh toán'}</div>
                  <div className='value'>{formatNumber(order.prepaid)}</div>
                </div>
                <div className='footer-element'>
                  <div className='label'>{'Tổng thanh toán'}</div>
                  <div className='total'>{formatNumber(order.cod)}</div>
                </div>
              </div>
            </div>
          </div>
          <div className='container'>
            <div className='payment-method'>
              <div className='title'>
                <CreditCardOutlined style={{ fontSize: 16, marginTop: 2 }} />
                <div className='text'>{'Phương thức thanh toán'}</div>
              </div>
              <div className='payment-select'>
                <Radio.Group onChange={e => changeMethod(e.target.value)} value={method}>
                  <Space direction="vertical">
                    <Radio value={'momo'}>
                      <img style={{ width: 20, height: 20 }} src="/momo_icon.svg" />
                      <span className='text'>{'Thanh toán bằng Momo'}</span>
                    </Radio>
                    <Radio value={'vnpay'} style={{ marginTop: 5 }}>
                      <img style={{ width: 20, height: 20 }} src="/vnpay_icon.svg" />
                      <span className='text'>{'Thanh toán bằng VNPAY'}</span>
                    </Radio>
                  </Space>
                </Radio.Group>
              </div>
              <div className='payment-button'>
                <div className='button' onClick={handleClickPayment}>
                  {'Thanh toán'}
                </div>
              </div>
            </div>
          </div>
        </div>}
        <div className="footer-payment">
          <div className='content'>
            <div className='contact'>
              <img style={{ width: 132, height: 32 }} src="/pancake_footer.svg" />
              <div style={{ width: 1, height: 32, background: '#D9D9D9', margin: '0 10px' }} />
              <div className='text-footer'>
                <PhoneOutlined />
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', margin: 5 }}>{'Hotline'}:</div>
                <div style={{ color: '#1890FF' }}>{'096 781 5129'}</div>
              </div>
              <div className='text-footer' style={{ marginLeft: 20 }}>
                <GlobalOutlined />
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', margin: 5 }}>{'Website'}:</div>
                <div
                  onClick={() => window.open('https://pages.fm/', '_blank')}
                  style={{ color: '#1890FF', cursor: 'pointer' }}>
                    {'https://pages.fm/'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className='support-text'>Copyright © 2020 Pancake</div>
              <div className='app-mobile'>
                <img style={{ width: 118, height: 30, marginRight: 10 }} src="/app_store.svg" />
                <img style={{ width: 118, height: 30 }} src="/apple_store.svg" />
              </div>
            </div>
          </div>          
        </div>
      </div>
    </>
  );
}

export default Payment;
