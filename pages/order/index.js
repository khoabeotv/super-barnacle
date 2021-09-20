import Head from 'next/head';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { Spin, Input, Avatar, Button, message, Result } from 'antd';
import {
  LoadingOutlined,
  WhatsAppOutlined,
  InfoCircleFilled,
  CheckCircleFilled
} from '@ant-design/icons';

import Address from 'components/Address';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [title, setTitle] = useState('Loading...');
  const [info, setInfo] = useState({});
  const [isValid, setValid] = useState();
  const [success, setSuccess] = useState();
  const query = useRef({});

  useEffect(() => {
    if (router.query.i)
      query.current = router.query.i
        ? JSON.parse(Buffer.from(router.query.i, 'base64').toString('ascii'))
        : {};

    if (query.current.cid && query.current.pid) {
      axios
        .get(`${API_BASE}/info`, {
          params: { cid: query.current.cid, pid: query.current.pid }
        })
        .then((res) => {
          if (res.data.info) setInfo(res.data.info);
          setTitle(res.data.page_name);
          setLoading(false);
        });
    }
  }, [router.query]);

  const onChange = (key, value) => setInfo({ ...info, [key]: value });

  const checkFBName = () => {
    setValid('');
    axios
      .get(`${API_BASE}/fbname`, {
        params: { name: info.full_name, pid: query.current.pid }
      })
      .then((res) => {
        setValid(res.data.is_valid);
      });
  };

  const onSubmit = () => {
    if (submitLoading) return;
    setSubmitLoading(true);
    axios
      .post(`${API_BASE}/create`, {
        cid: query.current.cid,
        pid: query.current.pid,
        info
      })
      .then(() => {
        setSuccess(true);
        setSubmitLoading(false);
      })
      .catch(() => {
        setSubmitLoading(false);
        checkFBName();
        message.error('Oops. Something went wrong. Please try again later.');
      });
  };

  const getFBNameSuffix = () => {
    switch (isValid) {
      case undefined:
        return null;

      case '':
        return <LoadingOutlined />;

      case false:
        return <InfoCircleFilled style={{ color: '#f5222d' }} />;

      case true:
        return <CheckCircleFilled style={{ color: '#52c41a' }} />;
    }
  };

  const form = [
    [
      'FB Name',
      <>
        <Input
          onBlur={checkFBName}
          value={info.full_name}
          onChange={(e) => onChange('full_name', e.target.value)}
          suffix={getFBNameSuffix()}
        />
        {isValid === false && (
          <div style={{ color: '#f5222d' }}>
            FB account has not interacted with {title}'s Facebook Page
          </div>
        )}
      </>
    ],
    [
      'Phone number',
      <Input
        value={info.phone_number}
        onChange={(e) => onChange('phone_number', e.target.value)}
      />
    ],
    [
      'Address',
      <Address
        address={info.address}
        province_id={info.province_id}
        district_id={info.district_id}
        commune_id={info.commune_id}
        onChange={onChange}
      />
    ],
    [
      'Product information',
      <Input.TextArea
        value={info.note}
        onChange={(e) => onChange('note', e.target.value)}
      />
    ],
    [
      null,
      <Button
        loading={submitLoading}
        onClick={onSubmit}
        disabled={!isValid}
        type="primary mgt-16"
        style={{ width: '100%' }}
      >
        Submit
      </Button>
    ]
  ];

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/logo.png" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      {loading ? (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
      ) : success ? (
        <Result status="success" title="Successfully Ordered" />
      ) : (
        <div className="flex-center">
          <div className="form-wrapper flex-center flex-column">
            <Avatar
              className="rounded mgb-16"
              size={100}
              src={`https://pages.fm/api/v1/whatsapp/avatar?page_id=wa_c.us@${query.current.pid}`}
            />
            <h2 className="mgb-8">{title}</h2>
            <a
              className="mgb-16"
              target="_blank"
              href={`https://wa.me/${query.current.pid}`}
            >
              <WhatsAppOutlined /> +{query.current.pid}
            </a>

            <div className="form-container">
              {form.map(([label, component], idx) => (
                <div key={idx} className="mgb-8">
                  <div className="fw-600">{label}</div>
                  {component}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
