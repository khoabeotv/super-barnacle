import axios from 'axios';
import { useRef } from 'react';
import { Input, Select } from 'antd';
import { useEffect, useState } from 'react';

import { fuzzySearch } from 'utils';

const Address = ({
  onChange,
  address,
  province_id,
  district_id,
  commune_id,
}) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [communes, setCommunes] = useState([]);
  const didMountRef = useRef(false);
  const communeRef = useRef();
  const districtRef = useRef();

  useEffect(() => {
    setDistricts([]);
    getDistricts();
    if (didMountRef.current) onChange('district_id', undefined);
  }, [province_id]);

  useEffect(() => {
    setCommunes([]);
    getCommunes();
    if (didMountRef.current) onChange('commune_id', undefined);
  }, [district_id]);

  useEffect(() => {
    getProvinces();
    didMountRef.current = true;
  }, []);

  const getProvinces = () => {
    const provinces = JSON.parse(localStorage.getItem('provinces_62'));
    if (provinces) setProvinces(provinces);
    else
      axios
        .get(`https://pos.pages.fm/api/v1/geo/provinces?country_code=62`)
        .then((res) => {
          localStorage.setItem('provinces_62', JSON.stringify(res.data.data));
          setProvinces(res.data.data);
        });
  };
  const getDistricts = () => {
    if (!province_id) return;
    const districts = JSON.parse(
      localStorage.getItem('districts_' + province_id)
    );
    if (districts) setDistricts(districts);
    else
      axios
        .get(
          `https://pos.pages.fm/api/v1/geo/districts?province_id=${province_id}`
        )
        .then((res) => {
          localStorage.setItem(
            'districts_' + province_id,
            JSON.stringify(res.data.data)
          );
          setDistricts(res.data.data);
        });
  };
  const getCommunes = () => {
    if (!district_id) return;
    const communes = JSON.parse(
      localStorage.getItem('communes_' + district_id)
    );
    if (communes) setCommunes(communes);
    else
      axios
        .get(
          `https://pos.pages.fm/api/v1/geo/communes?district_id=${district_id}`
        )
        .then((res) => {
          localStorage.setItem(
            'communes_' + district_id,
            JSON.stringify(res.data.data)
          );
          setCommunes(res.data.data);
        });
  };

  return (
    <>
      <Input
        value={address}
        onChange={(e) => onChange('address', e.target.value)}
        placeholder="Jalan"
        className="mgb-5"
      />
      <div className="flex">
        <Select
          options={provinces.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          showSearch
          filterOption={(input, option) => fuzzySearch(input, option.label)}
          value={province_id}
          onChange={(value) => {
            onChange('province_id', value);
            districtRef.current.focus();
          }}
          showAction={['focus', 'click']}
          style={{ width: '100%', marginRight: 5 }}
          placeholder="Propinsi"
        />
        <Select
          options={districts.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          ref={districtRef}
          value={district_id}
          onChange={(value) => {
            onChange('district_id', value);
            communeRef.current.focus();
          }}
          showAction={['focus', 'click']}
          style={{ width: '100%', marginRight: 5 }}
          placeholder="Daerah"
        />
        <Select
          options={communes.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          showAction={['focus', 'click']}
          ref={communeRef}
          value={commune_id}
          onChange={(value) => onChange('commune_id', value)}
          style={{ width: '100%' }}
          placeholder="Komune"
        />
      </div>
    </>
  );
};

export default Address;
