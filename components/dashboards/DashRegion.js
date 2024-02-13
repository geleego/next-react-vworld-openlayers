import { useState, useEffect } from 'react';
import { Descriptions, Select } from 'antd';
import { getAPIData } from '../../lib/api';

const { Option } = Select;

const DashRegion = ({ propRegion, onChangeRegion }) => {
  const [allRegion, setAllRegion] = useState([]);
  const [code, setCode] = useState([]);
  const [region, setRegion] = useState([]);
  const [selectCode, setSelectCode] = useState();
  const [selectRegion, setSelectRegion] = useState();
  const [popDist, setPopDist] = useState([]);
  const [place, setPlace] = useState([]);

  /**
   * 코드 기준으로 중복배열 제거 reducer
   * @param {*} a
   * @param {*} b
   */
  const uniqueReducer = (a, b) => {
    if (b && !a.some((o) => o['code_cd'] === b['code_cd'])) {
      a.push(b);
    }
    return a;
  };

  /**
   * 코드가 가지는 지역 목록 필터링
   */
  const filterRegions = () => {
    return allRegion.filter((o) => o.um_cd === selectCode.code_cd) || [];
  };

  /**
   * 코드 선택
   * @param {string} value
   */
  const onSelectCode = (value) => {
    const match = code.find((o) => o.code_cd === value) || {};
    setSelectCode(match);
  };

  /**
   * 지역 선택
   * @param {string}} value
   */
  const onSelectRegion = (value) => {
    const match = region.find((o) => o.region_cd === value) || undefined;
    // setSelectRegion(match);
    onChangeRegion(match.region_cd);
  };

  /**
   * 중점, 지점 구호소 구분
   * @param {string} value
   * @returns
   */
  const parsingAid = (value) => {
    const [main, sub] = value.split('/');
    return (
      <>
        <span className="bold">[중점] {main}</span>
        <div>{sub}</div>
      </>
    );
  };

  const parsingRoute = (value, type) => {
    const lines = value.split('\n');
    return (
      <>
        {lines.map((l, idx) => {
          var className = ['[', '*'].some((s) => l.includes(s)) ? 'other' : '';
          return (
            <div key={`${type}-${idx}`} className={className}>
              {l}
            </div>
          );
        })}
      </>
    );
  };

  /**
   * 지역 전체 데이터 조회(필터 처리용)
   */
  useEffect(() => {
    getAPIData('/api/region')
      .then((list) => {
        if (list) {
          setAllRegion(list);
        }
      })
      .catch((e) => {
        console.log('failed get region list :: ', e.message);
      });
  }, []);

  /**
   * 전체 지역 데이터 세팅 후 코드 중복제거
   */
  useEffect(() => {
    if (allRegion.length) {
      const codes = allRegion.map((o) =>
        Object.assign({}, { code: o.um, code_cd: o.um_cd }),
      );
      setCode(codes.reduce(uniqueReducer, []));
    }
  }, [allRegion]);

  /**
   * 코드 목록 필터 후 기본값 세팅
   */
  useEffect(() => {
    setSelectCode(code[0] || []);
  }, [code]);

  /**
   * 코드 기본값 세팅 후 지역 목록 필터링
   */
  useEffect(() => {
    const regionList = filterRegions() || [];
    setRegion(filterRegions() || []);
    // setSelectRegion(regionList[0] || undefined);
  }, [selectCode]);

  /**
   * 지역 상세정보 호출
   */
  useEffect(() => {
    if (selectRegion) {
      getAPIData(`/api/ulju/pop_dist/region_cd/${selectRegion.region_cd}`)
        .then((list) => {
          setPopDist(list[0]);
        })
        .catch((e) => {
          console.log('failed to get region info data : ', e.message);
          setPopDist();
        });
      getAPIData(`/api/place/region_cd/${selectRegion.region_cd}`)
        .then((list) => {
          window['foo'] = list;
          setPlace(list[0]);
        })
        .catch((e) => {
          console.log('failed to get region info data : ', e.message);
          setPlace();
        });
    }
  }, [selectRegion]);

  /**
   * 지도에서 지역 선택 시 조회기능 처리
   */
  useEffect(() => {
    if (propRegion) {
      const match = allRegion.find((o) => o.region_cd === propRegion) || undefined;
      if (match) {
        setSelectCode({ code_cd: match.um_cd, code: match.um });
      }
      setSelectRegion(match);
    }
  }, [propRegion]);

  return (
    <RegionLayout>
      <div className="RegionWarp">
        <DescriptionStyled
          title={'지역 확인'}
          bordered
          layout="vertical"
          size="small"
          column={{ xxl: 6, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}>
          <Descriptions.Item label="코드">
            <SelectStyle
              showSearch
              optionFilterProp="children"
              onSelect={onSelectCode}
              value={selectCode ? selectCode['code_cd'] : undefined}
              placeholder="코드">
              {code.map((o) => (
                <Option key={o.code_cd}>{o.code}</Option>
              ))}
            </SelectStyle>
          </Descriptions.Item>
          <Descriptions.Item label="지역">
            <SelectStyle
              showSearch
              optionFilterProp="children"
              onSelect={onSelectRegion}
              value={selectRegion ? selectRegion['region_cd'] : undefined}
              placeholder="지역">
              {region.map((o) => (
                <Option key={o.region_cd}>{o.region}</Option>
              ))}
            </SelectStyle>
          </Descriptions.Item>
        </DescriptionStyled>
      </div>
    </RegionLayout>
  );
};

export default DashRegion;
