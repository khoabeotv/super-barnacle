import { CopyOutlined, StarFilled } from '@ant-design/icons';
import { Timeline } from 'antd';
import TimelineItem from 'antd/lib/timeline/TimelineItem';
import React from 'react';
import Copy from '../../components/Copy';

const data = [
  {
    title: 'Thông tin shop',
    value: 'shop_info',
    items: [
      { label: 'Tên shop', value: 'shop_name' },
      { label: 'Số lượng đơn đã giao', value: 'total_order' },
      { label: 'Tỉ lệ đơn thành công', value: 'success_orders' },
      { label: 'Đánh giá từ người mua', value: 'rating_customer' }
    ]
  },
  {
    title: 'Thông tin đơn hàng',
    value: 'order_info',
    items: [
      { label: 'Mã vận đơn', value: 'display_id' },
      { label: 'Số lượng đơn đã giao', value: 'order_date' },
      {
        label: 'Tỉ lệ đơn thành công',
        value: 'order_status',
        style: { fontWeight: 500 }
      },
      {
        label: 'Đánh giá từ người mua',
        value: 'order_partner',
        style: { fontWeight: 500 }
      },
      { label: 'Tracking ID', value: 'tracking_id', style: { fontWeight: 500 } }
    ]
  },
  {
    title: 'Thông tin người nhận',
    value: 'customer_info',
    items: [
      {
        label: 'Họ và tên',
        value: 'customer_name',
        style: { fontWeight: 500 }
      },
      {
        label: 'Số điện thoại',
        value: 'customer_phone',
        style: { fontWeight: 500 }
      },
      {
        label: 'Địa chỉ',
        value: 'customer_address',
        style: { fontWeight: 500 }
      }
    ]
  }
];

const currenShop = {
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

function Tracking() {
  return (
    <div>
      <div className="header-tracking">
        <div className="header-title">Theo dõi đơn hàng</div>
      </div>
      <div className="tracking-rows">
        <div className="tracking-col" style={{ marginRight: '24px' }}>
          {data.map((info) => {
            return (
              <div className="tracking-card" key={info.valua}>
                <div className="tracking-box">
                  <div
                    className="tracking-title"
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <div>{info.title}</div>
                  </div>
                  <div className="tracking-body">
                    <div className="tracking-list">
                      {info.items.map((item) => {
                        let value;
                        switch (info.value) {
                          case 'shop_info':
                            value = currenShop[item.value];
                            break;
                          case 'order_info':
                            value = order[item.value];
                            break;
                          case 'customer_info':
                            value = order.customer[item.value];
                            break;
                          default:
                            break;
                        }

                        return (
                          <div className="tracking-item">
                            <div
                              style={{
                                fontSize: '14px',
                                fontWeight: item?.style?.fontWeight
                                  ? item.style.fontWeight
                                  : 700
                              }}
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
                            ) : item.value == 'rating_customer' ? (
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
            );
          })}
        </div>
        <div className="tracking-col" style={{ flex: 1 }}>
          <div className="tracking-card" style={{ marginBottom: '24px' }}>
            <div className="tracking-box">
              <div
                className="tracking-title"
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <div>Trạng thái đơn hàng</div>
              </div>
              <div
                className="tracking-body"
                style={{ padding: '16px 24px', flex: 1, height: '100%' }}
              >
                <Timeline className="tracking-timeline" mode="left">
                  {order.extend_updates.map((item, index) => {
                    const active = false; // active khi timestame trả về lớn hơn hoặc bằng hiện tại
                    return (
                      <TimelineItem
                        color={active ? 'green' : ''}
                        key={`${item.status}${index}`}
                      >
                        <div>
                          <div
                            style={{
                              marginBottom: '4px',
                              fontSize: '16px',
                              lineHeight: '1.5',
                              fontWeight: 'bold',
                              color: active ? "rgba(0, 0, 0, 0.65)" : 'rgba(0, 0, 0, 0.45)'
                            }}
                          >
                            {item.status}
                          </div>
                          {item.note && (
                            <div
                              style={{
                                marginBottom: '4px',
                                fontSize: '16px',
                                lineHeight: '1.5',
                                color: active ? "rgba(0, 0, 0, 0.65)" : 'rgba(0, 0, 0, 0.45)'
                              }}
                            >
                              {item.note}
                            </div>
                          )}
                          {item.location && (
                            <div>
                              <EnvironmentOutlined /> {item.location}
                            </div>
                          )}
                          <div
                            style={{
                              marginBottom: '4px',
                              fontSize: '16px',
                              lineHeight: '1.5',
                              color: active ? "rgba(0, 0, 0, 0.65)" : 'rgba(0, 0, 0, 0.45)'
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
    </div>
  );
}

export default Tracking;
