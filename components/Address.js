import axios from 'axios';
import { useRef } from 'react';
import { Input, Select } from 'antd';
import { useEffect, useState } from 'react';

import { fuzzySearch } from 'utils';

const Address = ({
  onChange,
  onChanges,
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
      {!address && (
        <div style={{ color: '#f5222d' }}>
          Tidak boleh dibiarkan kosong!
        </div>
      )}
      <div className="flex" style={{ flexWrap: 'wrap', flexDirection: 'column' }}>
        <Select
          options={provinces.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          showSearch
          filterOption={(input, option) => fuzzySearch(input, option.label)}
          value={province_id}
          onChange={(value) => {
            const province = provinces.find(d => d.id == value)
            onChanges({
              province_id: value,
              province: province.name
            })
            districtRef.current.focus();
          }}
          showAction={['focus', 'click']}
          style={{ flex: 1 }}
          placeholder="Provinsi"
        />
        {!province_id && (
          <div style={{ color: '#f5222d' }}>
            Tidak boleh dibiarkan kosong!
          </div>
        )}
        <Select
          options={districts.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          showSearch
          filterOption={(input, option) => fuzzySearch(input, option.label)}
          ref={districtRef}
          value={district_id}
          onChange={(value) => {
            const district = districts.find(d => d.id == value)
            onChanges({
              district_id: value,
              district: district.name
            })
            communeRef.current.focus();
          }}
          showAction={['focus', 'click']}
          style={{ flex: 1 }}
          placeholder="Kabupaten"
        />
        {!district_id && (
          <div style={{ color: '#f5222d' }}>
            Tidak boleh dibiarkan kosong!
          </div>
        )}
        <Select
          options={communes.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          showSearch
          filterOption={(input, option) => fuzzySearch(input, option.label)}
          showAction={['focus', 'click']}
          ref={communeRef}
          value={commune_id}
          onChange={(value) => {
            const commune = communes.find(d => d.id == value)
            onChanges({
              commune_id: value,
              commune: commune.name
            })
          }}
          style={{ flex: 1 }}
          placeholder="Kecamatan"
        />
        {!commune_id && (
          <div style={{ color: '#f5222d' }}>
            Tidak boleh dibiarkan kosong!
          </div>
        )}
      </div>
    </>
  );
};

export default Address;
