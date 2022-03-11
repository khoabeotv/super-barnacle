import { CopyOutlined, StarFilled, LoadingOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Timeline, Spin } from 'antd';
import TimelineItem from 'antd/lib/timeline/TimelineItem';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import OtpInput from 'react-otp-input';
import { formatDateTime } from 'utils';
import Copy from '../../components/Copy';
import { useDeviceSize } from '../../hooks/useDeviceSize';
import i18n, { getTranslation, startI18n } from '../../i18n';
import { getLangFromCountryCode, getMobileOperatingSystem } from '../../utils';

const getData = (id, phone_number) => {
  return axios
    .get(`${API_BASE}/tracking`, {
      params: { id, phone_number }
    })
    .then((res) => res.data)
    .catch(() => ({ success: false, require_phone_number: true }));
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
      value: 'status'
    },
    {
      label: 'Đơn vị vận chuyển',
      value: 'partner_name'
    }
  ]
};

const customerInfo = {
  title: 'Thông tin người nhận',
  value: 'customer_info',
  items: [
    {
      label: 'Họ và tên',
      value: 'bill_full_name'
    },
    {
      label: 'Số điện thoại',
      value: 'bill_phone_number'
    },
    {
      label: 'Địa chỉ',
      value: 'address',
      styles: {
        label: {
          mobile: { whiteSpace: 'nowrap' }
        }
      }
    }
  ]
};

function Tracking(props) {
  const router = useRouter();
  const [width] = useDeviceSize();
  const [fourDigitsPhone, setFourDigitsPhone] = useState('');
  const [verifyOTP] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [order, setOrder] = useState();
  const [platform, setPlatform] = useState('unknown');
  const [locale, setLocale] = useState('');

  useEffect(async () => {
    if (router.query.id) {
      const data = await getData(router.query.id);
      const locale = getLangFromCountryCode(data?.country_code);
      const trans = await getTranslation(locale);
      setLocale(locale);
      startI18n(trans, locale);
      setOrder(data);
      setDataLoading(false);
      setPlatform(getMobileOperatingSystem());
    }
  }, [router.query]);

  const renderTitle = () => {
    if (verifyOTP) {
      return (
        <div style={{ textAlign: 'center' }}>
          {i18n.t('Xác thực quyền truy cập')}
        </div>
      );
    }
    return <div>{i18n.t('Tìm kiếm đơn hàng')}</div>;
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

  if (dataLoading)
    return (
      <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
    );

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
          <div className="header-title">{i18n.t('Theo dõi đơn hàng')}</div>
        </div>
        <div className="tracking-rows">
          {!order.require_phone_number && (
            <>
              <div className="tracking-col">
                <div className="tracking-card">
                  <div className="tracking-box">
                    <div className="tracking-header">
                      {i18n.t(shopInfo.title)}
                    </div>
                    <div className="tracking-body">
                      {width < 769 ? (
                        <div>
                          <div className="tracking-item">
                            <div className="tracking-label">
                              {i18n.t('Tên shop')}
                            </div>
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
                              <div className="tracking-item" key={item.value}>
                                <div className="tracking-label">
                                  {i18n.t(item.label)}
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
                    <div className="tracking-header">
                      {i18n.t(orderInfo.title)}
                    </div>
                    <div className="tracking-body">
                      <div className="tracking-list">
                        {orderInfo.items.map((item) => {
                          let value = order[item.value];
                          return (
                            <div className="tracking-item" key={item.value}>
                              <div className="tracking-label">
                                {i18n.t(item.label)}
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
                    <div className="tracking-header">
                      {i18n.t(customerInfo.title)}
                    </div>
                    <div className="tracking-body">
                      <div className="tracking-list">
                        {customerInfo.items.map((item) => {
                          let value = order[item.value];
                          return (
                            <div className="tracking-item" key={item.value}>
                              <div
                                className="tracking-label"
                                style={{
                                  whiteSpace: item?.styles
                                    ? item?.styles?.label?.mobile?.whiteSpace
                                    : 'unset'
                                }}
                              >
                                {i18n.t(item.label)}
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
                    <div className="tracking-header">
                      {i18n.t('Trạng thái đơn hàng')}
                    </div>
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
                                {/* {item.note && (
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
                                )} */}
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
                                  {formatDateTime(item.updated_at || item.update_at, true)}
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
            </>
          )}
        </div>
        {order.require_phone_number && (
          <Modal
            title={renderTitle()}
            wrapClassName="tracking-modal"
            visible={true}
            closable={false}
            footer={
              <Button size="large" block onClick={onConfirm} loading={loading}>
                {i18n.t('Tra cứu')}
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
                    {i18n.t('Xác nhận quyền truy cập đơn hàng')}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: 'rgba(0, 0, 0, 0.45)'
                    }}
                  >
                    * {i18n.t('Nhập 4 số cuối số điện thoại đặt hàng')}
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
                  * {i18n.t('Nhập 4 số cuối số điện thoại đặt hàng')}
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
                    {i18n.t('Số điện thoại không chính xác')}
                  </div>
                )}
              </div>
            )}
          </Modal>
        )}

        {locale == 'vi' && Math.floor(Math.random() * 100) < 0 && (
          <div className="footer-tracking">
            <div className="footer-left">
              <div>
                <img src={width < 769 ? '/LOGOmd.svg' : '/LOGO.svg'} />
              </div>
              {width > 769 && (
                <div
                  style={{
                    width: 2,
                    height: 46,
                    background: '#d9d9d9',
                    margin: '0 12px'
                  }}
                />
              )}
              <div style={{ marginBottom: width > 769 ? 0 : 8 }}>
                <div className="footer-title">
                  {i18n.t('Tải ngay Levera để theo dõi toàn bộ đơn hàng')}
                </div>
                <div className="footer-desc">
                  {i18n.t('Tìm hiểu thêm về Levera')}:{' '}
                  <a style={{ color: '#EB7E5A' }} href="https://levera.vn/">
                    levera.vn
                  </a>
                </div>
              </div>
            </div>
            <div className="footer-right">
              {width > 769 && (
                <div
                  style={{
                    marginRight: 12
                  }}
                >
                  <img src="/qrcode.gif" alt="" />
                </div>
              )}
              {width < 769 ? (
                <div>
                  {platform == 'Android' && (
                    <div>
                      <a href="https://play.google.com/store/apps/details?id=com.levera.pay.app&hl=en&gl=US">
                        <img src="/googleplay.svg" alt="" />
                      </a>
                    </div>
                  )}
                  {platform == 'iOS' && (
                    <div>
                      <a href="https://apps.apple.com/vn/app/levera-pay/id1601450085?l=vi&fbclid=IwAR30J4-r9rkJQbjUU-25xqDEzYk5jtyJ5uCsGCgAs1eNamlZ_RGhlJqcYRg">
                        <img src="/appstore.svg" alt="" />
                      </a>
                    </div>
                  )}
                  {platform == 'unknown' && (
                    <>
                      <div style={{ marginBottom: 8 }}>
                        <a href="https://play.google.com/store/apps/details?id=com.levera.pay.app&hl=en&gl=US">
                          <img src="/googleplay.svg" alt="" />
                        </a>
                      </div>
                      <div>
                        <a href="https://apps.apple.com/vn/app/levera-pay/id1601450085?l=vi&fbclid=IwAR30J4-r9rkJQbjUU-25xqDEzYk5jtyJ5uCsGCgAs1eNamlZ_RGhlJqcYRg">
                          <img src="/appstore.svg" alt="" />
                        </a>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: 8 }}>
                    <a href="https://play.google.com/store/apps/details?id=com.levera.pay.app&hl=en&gl=US">
                      <img src="/googleplay.svg" alt="" />
                    </a>
                  </div>
                  <div>
                    <a href="https://apps.apple.com/vn/app/levera-pay/id1601450085?l=vi&fbclid=IwAR30J4-r9rkJQbjUU-25xqDEzYk5jtyJ5uCsGCgAs1eNamlZ_RGhlJqcYRg">
                      <img src="/appstore.svg" alt="" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Tracking;
