import dynamic from 'next/dynamic';
import { Dropdown, Menu } from 'antd';
import Headers from '../components/commons/Headers';
import { getAPIData } from '../lib/api';

const DashBoard = dynamic(() => import('../components/dashboards/DashBoard'), {
  ssr: false,
});

const Index = ({ urls }) => {
  /**
   * find object || filter objects
   * @param {string} key
   * @param {string} value
   * @param {string} type object | array
   */
  const findUrl = (key, value, type = 'object') => {
    if (!urls.length) {
      return {};
    }
    switch (type) {
      case 'object':
        return urls.find((url) => url[key] === value);
      case 'array':
        return urls.filter((url) => url[key] === value);
      default:
        urls.find((url) => url[key] === value);
    }
  };

  const MENUS = [
    {
      id: 'MAP',
      icon: 'fa fa-map-o',
      title: '지도',
      link: 'map'
    },
    {
      id: 'ETC',
      icon: 'fa fa-ellipsis-h',
      title: '기타 시스템',
      link: '',
      subMenus: () => dropMenu,
    },
  ];
  const dropMenu = (
    <Menu>
      <Menu.Item key="A">
        <SubA href={findUrl('key', 'A').url} target="_blank">
          A
        </SubA>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="B">
        <SubA href={findUrl('key', 'B').url} target="_blank">
          B
        </SubA>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="C">
        <SubA href={findUrl('key', 'C').url} target="_blank">
          C
        </SubA>
      </Menu.Item>
    </Menu>
  );

  /**
   * sessionStorage 유지
   * @param {string}} url
   */
  const win = (url) => {
    window.open(`${url}`, '_blank');
  };

  return (
    <>
      <Headers />
      <LandingStyle>
        <GNBStyle>
          {MENUS.map((o) => {
            if (o['subMenus']) {
              return (
                <Dropdown key={o['id']} overlay={o['subMenus']}>
                  <a>
                    <MenuWrap>
                      <div>
                        <i className={o['icon']} aria-hidden="true"></i>
                      </div>
                      <span className="fnt-nsqre">{o['title']}</span>
                    </MenuWrap>
                  </a>
                </Dropdown>
              );
            } else {
              return (
                <a key={o['id']} onClick={() => win(o['link'])}>
                  <MenuWrap>
                    <div>
                      <i className={o['icon']} aria-hidden="true"></i>
                    </div>
                    <span className="fnt-nsqre">{o['title']}</span>
                  </MenuWrap>
                </a>
              );
            }
          })}
        </GNBStyle>
        <DashBoard />
      </LandingStyle>
    </>
  );
};

Index.getInitialProps = async (ctx) => {
  const data = await getAPIData('/api/url');
  return { urls: data };
};

export default Index;
