import { CheckCircleFilled, CopyOutlined, StarFilled } from '@ant-design/icons';
import { Button, Input, Modal, Timeline } from 'antd';
import TimelineItem from 'antd/lib/timeline/TimelineItem';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OtpInput from 'react-otp-input';
import Copy from '../../components/Copy';
import { useDeviceSize } from '../../hooks/useDeviceSize';
import { formatDateTime } from 'utils';
import Head from 'next/head';

const getData = (id, phone_number) => {
  return axios
    .get(`${API_BASE}/tracking`, {
      params: { id, phone_number }
    })
    .then((res) => res.data)
    .catch(() => ({ success: false }));
};

const shopInfo = {
  title: 'Thông tin shop',
  value: 'shop_info',
  items: [{ label: 'Tên shop', value: 'shop_name' }]
};

const orderInfo = {
  title: 'Thông tin đơn hàng',
  value: 'order_info',
  items: [
    { label: 'Mã vận đơn', value: 'extend_code' },
    { label: 'Ngày đặt hàng', value: 'inserted_at' },
    {
      label: 'Trạng thái đơn hàng',
      value: 'status',
      styles: { label: { desktop: { fontWeight: 500 } } }
    },
    {
      label: 'Đơn vị vận chuyển',
      value: 'partner_name',
      styles: { label: { desktop: { fontWeight: 500 } } }
    }
  ]
};

const customerInfo = {
  title: 'Thông tin người nhận',
  value: 'customer_info',
  items: [
    {
      label: 'Họ và tên',
      value: 'bill_full_name',
      styles: { label: { desktop: { fontWeight: 500 } } }
    },
    {
      label: 'Số điện thoại',
      value: 'bill_phone_number',
      styles: { label: { desktop: { fontWeight: 500 } } }
    },
    {
      label: 'Địa chỉ',
      value: 'address',
      styles: {
        label: {
          desktop: { fontWeight: 500 },
          mobile: { whiteSpace: 'nowrap' }
        }
      }
    }
  ]
};

function Tracking(props) {
  const [width] = useDeviceSize();
  const [fourDigitsPhone, setFourDigitsPhone] = useState('');
  const [verifyOTP] = useState(true);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(props.data);

  const renderTitle = () => {
    if (verifyOTP) {
      return <div style={{ textAlign: 'center' }}>Xác thực quyền truy cập</div>;
    }
    return <div>Tìm kiếm đơn hàng</div>;
  };

  const handlePhoneNumberChange = (fourDigits) => {
    setFourDigitsPhone(fourDigits);
  };

  const onConfirm = async () => {
    setLoading(true);
    const res = await getData(props.id, fourDigitsPhone);
    setOrder(res);
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Pancake Tracking</title>
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
      <div className="tracking-container">
        <div className="header-tracking">
          <div className="header-title">Theo dõi đơn hàng</div>
        </div>
        {!order.require_phone_number ? (
          <div className="tracking-rows">
            <div className="tracking-col">
              <div className="tracking-card">
                <div className="tracking-box">
                  <div className="tracking-header">{shopInfo.title}</div>
                  <div className="tracking-body">
                    {width < 769 ? (
                      <div>
                        <div className="tracking-item">
                          <div className="tracking-label">Tên shop</div>
                          <div className="tracking-value">
                            {order.shop_name}
                          </div>
                        </div>
                        {/* <div className="tracking-item">
                        <div className="tracking-value">
                          <div className="tracking-value">
                            {currenShopInfo.rating_customer}/5{' '}
                            <StarFilled style={{ color: '#FFC53D' }} />
                          </div>
                        </div>
                        <div className="tracking-value">
                          {currenShopInfo.total_order} đơn (
                          {currenShopInfo.success_orders}%){' '}
                          <CheckCircleFilled style={{ color: '#27AE60' }} />
                        </div>
                      </div> */}
                      </div>
                    ) : (
                      <div className="tracking-list">
                        {shopInfo.items.map((item) => {
                          let value = order[item.value];
                          return (
                            <div className="tracking-item">
                              <div
                                style={{
                                  fontWeight: item?.styles
                                    ? item.styles.label.desktop.fontWeight
                                    : 700
                                }}
                                className="tracking-label"
                              >
                                {item.label}
                              </div>
                              {item.value == 'rating_customer' ? (
                                <div className="tracking-value">
                                  {value}/5{' '}
                                  <StarFilled style={{ color: '#FFC53D' }} />
                                </div>
                              ) : (
                                <div className="tracking-value">{value}</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="tracking-card">
                <div className="tracking-box">
                  <div className="tracking-header">{orderInfo.title}</div>
                  <div className="tracking-body">
                    <div className="tracking-list">
                      {orderInfo.items.map((item) => {
                        let value = order[item.value];
                        return (
                          <div className="tracking-item">
                            <div
                              style={{
                                fontWeight: item?.style?.fontWeight
                                  ? item.styles.label.desktop.fontWeight
                                  : 700
                              }}
                              className="tracking-label"
                            >
                              {item.label}
                            </div>
                            {item.value == 'extend_code' ? (
                              <Copy copyText={value}>
                                <CopyOutlined />
                                <span
                                  style={{ marginLeft: '9.71px' }}
                                  className="tracking-value"
                                >
                                  {value}
                                </span>
                              </Copy>
                            ) : item.value == 'inserted_at' ? (
                              <div className="tracking-value">
                                {formatDateTime(value, true)}
                              </div>
                            ) : (
                              <div className="tracking-value">{value}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="tracking-card">
                <div className="tracking-box">
                  <div className="tracking-header">{customerInfo.title}</div>
                  <div className="tracking-body">
                    <div className="tracking-list">
                      {customerInfo.items.map((item) => {
                        let value = order[item.value];
                        return (
                          <div className="tracking-item">
                            <div
                              className="tracking-label"
                              style={{
                                whiteSpace: item?.styles
                                  ? item?.styles?.label?.mobile?.whiteSpace
                                  : 'unset',
                                fontWeight: item?.style?.fontWeight
                                  ? item.styles.label.desktop.fontWeight
                                  : 700
                              }}
                            >
                              {item.label}
                            </div>
                            {item.value == 'rating_customer' ? (
                              <div className="tracking-value">
                                {value}/5{' '}
                                <StarFilled style={{ color: '#FFC53D' }} />
                              </div>
                            ) : (
                              <div className="tracking-value">{value}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tracking-col">
              <div className="tracking-card">
                <div className="tracking-box">
                  <div className="tracking-header">Trạng thái đơn hàng</div>
                  <div
                    className="tracking-body"
                    style={{ padding: '16px 24px', flex: 1, height: '100%' }}
                  >
                    <Timeline className="tracking-timeline" mode="left">
                      {order.extend_update.map((item, index) => {
                        const active = index == 0;
                        return (
                          <TimelineItem
                            color={active ? 'green' : ''}
                            key={`${item.status}${index}`}
                          >
                            <div>
                              <div
                                className="tracking-status"
                                style={{
                                  color: active
                                    ? 'rgba(0, 0, 0, 0.65)'
                                    : 'rgba(0, 0, 0, 0.45)'
                                }}
                              >
                                {item.status}
                              </div>
                              {item.note && (
                                <div
                                  className="tracking-note"
                                  style={{
                                    color: active
                                      ? 'rgba(0, 0, 0, 0.65)'
                                      : 'rgba(0, 0, 0, 0.45)'
                                  }}
                                >
                                  {item.note}
                                </div>
                              )}
                              {item.location && (
                                <div
                                  className="tracking-note"
                                  style={{
                                    color: active
                                      ? 'rgba(0, 0, 0, 0.65)'
                                      : 'rgba(0, 0, 0, 0.45)'
                                  }}
                                >
                                  {item.location}
                                </div>
                              )}
                              <div
                                style={{
                                  fontSize: '16px',
                                  lineHeight: '1.5',
                                  color: active
                                    ? 'rgba(0, 0, 0, 0.65)'
                                    : 'rgba(0, 0, 0, 0.45)'
                                }}
                              >
                                {formatDateTime(item.updated_at, true)}
                              </div>
                            </div>
                          </TimelineItem>
                        );
                      })}
                    </Timeline>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Modal
            title={renderTitle()}
            wrapClassName="tracking-modal"
            visible={true}
            closable={false}
            footer={
              <Button size="large" block onClick={onConfirm} loading={loading}>
                Tra cứu
              </Button>
            }
          >
            {!verifyOTP ? (
              <div style={{ width: '100%' }}>
                <Input
                  className="tracking-input"
                  style={{ padding: '9px 16px' }}
                  placeholder="Nhập mã vận đơn"
                />
                <div style={{ margin: '16px 0 12px' }}>
                  <div
                    style={{
                      fontSize: '14px',
                      lineHeight: '22px',
                      color: 'rgba(0, 0, 0, 0.65)'
                    }}
                  >
                    Xác nhận quyền truy cập đơn hàng
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: 'rgba(0, 0, 0, 0.45)'
                    }}
                  >
                    * Nhập 4 số cuối số điện thoại đặt hàng
                  </div>
                </div>
                <OtpInput
                  hasErrored={true}
                  shouldAutoFocus={true}
                  isInputNum
                  value={fourDigitsPhone}
                  onChange={handlePhoneNumberChange}
                  inputStyle="tracking-input tracking-input-square"
                />
              </div>
            ) : (
              <div className="flex-center flex-column">
                <div
                  style={{
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: 'rgba(0, 0, 0, 0.45)',
                    marginBottom: 12
                  }}
                >
                  * Nhập 4 số cuối số điện thoại đặt hàng
                </div>
                <OtpInput
                  shouldAutoFocus={true}
                  isInputNum
                  value={fourDigitsPhone}
                  onChange={handlePhoneNumberChange}
                  inputStyle="tracking-input tracking-input-square"
                />
                {!order.success && (
                  <div className="error-text" style={{ marginTop: 12 }}>
                    Số điện thoại không chính xác
                  </div>
                )}
              </div>
            )}
          </Modal>
        )}
      </div>
    </>
  );
}

export default Tracking;

export async function getServerSideProps(context) {
  const id = context.query.id || null;
  let res = { require_phone_number: true };
  if (id) res = await getData(id);

  return {
    props: { id, data: res }
  };
}
