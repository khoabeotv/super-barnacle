import { CheckCircleFilled, CopyOutlined, StarFilled } from '@ant-design/icons';
import { Button, Input, Modal, Timeline } from 'antd';
import TimelineItem from 'antd/lib/timeline/TimelineItem';
import React, { useState } from 'react';
import OtpInput from 'react-otp-input';
import Copy from '../../components/Copy';
import { useDeviceSize } from '../../hooks/useDeviceSize';

const shopInfo = {
  title: 'Thông tin shop',
  value: 'shop_info',
  items: [
    { label: 'Tên shop', value: 'shop_name' },
    { label: 'Số lượng đơn đã giao', value: 'total_order' },
    { label: 'Tỉ lệ đơn thành công', value: 'success_orders' },
    { label: 'Đánh giá từ người mua', value: 'rating_customer' }
  ]
};

const orderInfo = {
  title: 'Thông tin đơn hàng',
  value: 'order_info',
  items: [
    { label: 'Mã vận đơn', value: 'display_id' },
    { label: 'Số lượng đơn đã giao', value: 'order_date' },
    {
      label: 'Tỉ lệ đơn thành công',
      value: 'order_status',
      styles: { label: { desktop: { fontWeight: 500 } } }
    },
    {
      label: 'Đánh giá từ người mua',
      value: 'order_partner',
      styles: { label: { desktop: { fontWeight: 500 } } }
    },
    {
      label: 'Tracking ID',
      value: 'tracking_id',
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
      value: 'customer_name',
      styles: { label: { desktop: { fontWeight: 500 } } }
    },
    {
      label: 'Số điện thoại',
      value: 'customer_phone',
      styles: { label: { desktop: { fontWeight: 500 } } }
    },
    {
      label: 'Địa chỉ',
      value: 'customer_address',
      styles: {
        label: {
          desktop: { fontWeight: 500 },
          mobile: { whiteSpace: 'nowrap' }
        }
      }
    }
  ]
};

const currenShopInfo = {
  shop_name: 'Bunny Moon',
  total_order: '129',
  success_orders: '89',
  rating_customer: '4.8'
};

const order = {
  display_id: 8703656590,
  order_date: '12:55 , 18/07/2021',
  order_status: 'Giao hàng thành công',
  order_partner: 'Viettel Post',
  tracking_id: 2321321321,
  customer: {
    customer_name: 'Hà Hành',
    customer_phone: '+84090908409',
    customer_address: 'Số 1A Ng. 165 P. Thái Hà, Láng Hạ, Đống Đa, Hà Nội'
  },
  extend_updates: [
    {
      updated_at: '15:55, Chủ nhật 18/07/2021',
      status: 'Giao hàng thành công',
      note: '',
      location: ''
    },
    {
      updated_at: '15:55, Chủ nhật 18/07/2021',
      status: 'Đang vận chuyển',
      note: 'Viettel đang vận chuyển',
      location: ''
    },
    {
      updated_at: '15:55, Chủ nhật 18/07/2021',
      status: 'Đơn đã xuất khỏi kho',
      note: 'Đơn hàng đã được xuất kho 20-HNI Tu Liem LMhub',
      location: ''
    },
    {
      updated_at: '15:55, Chủ nhật 18/07/2021',
      status: 'Hoàn tất đóng gói',
      note: 'Đóng gói thành công',
      location: ''
    },
    {
      updated_at: '15:55, Chủ nhật 18/07/2021',
      status: 'Đang lấy hàng',
      note: '',
      location: ''
    },
    {
      updated_at: '15:55, Chủ nhật 18/07/2021',
      status: 'Đã xử lý',
      note: 'Đơn hàng của bạn đã được xác nhận',
      location: ''
    }
  ]
};

let success = false;

function Tracking() {
  const [width] = useDeviceSize();
  const [fourDigitsPhone, setFourDigitsPhone] = useState('');
  const [verifyPhone] = useState(true);
  const [verifyOTP] = useState(false);

  const renderTitle = () => {
    if (verifyOTP) {
      return <div style={{ textAlign: 'center' }}>Xác thực quyền truy cập</div>;
    }
    return <div>Tìm kiếm đơn hàng</div>;
  };

  const handlePhoneNumberChange = (fourDigits) => {
    setFourDigitsPhone(fourDigits);
  };

  return (
    <div className="tracking-container">
      <div className="header-tracking">
        <div className="header-title">Theo dõi đơn hàng</div>
      </div>
      {success ? (
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
                          {currenShopInfo.shop_name}
                        </div>
                      </div>
                      <div className="tracking-item">
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
                      </div>
                    </div>
                  ) : (
                    <div className="tracking-list">
                      {shopInfo.items.map((item) => {
                        let value = currenShopInfo[item.value];
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
                          {item.value == 'display_id' ||
                          item.value == 'tracking_id' ? (
                            <Copy copyText={value}>
                              <CopyOutlined />
                              <span
                                style={{ marginLeft: '9.71px' }}
                                className="tracking-value"
                              >
                                {value}
                              </span>
                            </Copy>
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
                      let value = order.customer[item.value];
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
                    {order.extend_updates.map((item, index) => {
                      const active = false;
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
                            <div
                              style={{
                                fontSize: '16px',
                                lineHeight: '1.5',
                                color: active
                                  ? 'rgba(0, 0, 0, 0.65)'
                                  : 'rgba(0, 0, 0, 0.45)'
                              }}
                            >
                              {item.updated_at}
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
      ) : null}
      <Modal
        title={renderTitle()}
        wrapClassName="tracking-modal"
        visible={true}
        closable={false}
        footer={
          verifyOTP ? (
            <Button size="large" block>
              Tra cứu
            </Button>
          ) : (
            <Button size="large" block>
              Tiếp tục
            </Button>
          )
        }
      >
        {!verifyOTP ? (
          <div style={{ width: '100%' }}>
            <Input
              className="tracking-input"
              style={{ padding: '9px 16px' }}
              placeholder="Nhập mã vận đơn"
            />
            {verifyPhone && (
              <>
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
                  isInputNum
                  value={fourDigitsPhone}
                  onChange={handlePhoneNumberChange}
                  inputStyle="tracking-input tracking-input-square"
                />
              </>
            )}
          </div>
        ) : (
          <div className="flex-center">
            <OtpInput
              isInputNum
              value={fourDigitsPhone}
              onChange={handlePhoneNumberChange}
              inputStyle="tracking-input tracking-input-square"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Tracking;
