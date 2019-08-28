import React from 'react';

import './TabSidebar.scss';

import { Sidebar, Grid, Menu, Icon, Divider, Header } from 'semantic-ui-react';

import { MenuItems } from '../interface';

interface TabSidebarProps {
  title: string,
  tabMenuItems: MenuItems[],
  linkMenuItems: MenuItems[],
};

const TabSidebar: React.FunctionComponent<TabSidebarProps> = (props) => {
  const { title, tabMenuItems, linkMenuItems } = props;

  const [mobileSidebarVisible, setMobileSidebarVisible] = React.useState<boolean>(false);

  const [ActiveIndex, setActiveIndex] = React.useState<number>(0);
  const handelMenuItemClick = (event: React.SyntheticEvent, data: any) => {
    setActiveIndex(data['index']);
    setMobileSidebarVisible(false);
  }

  const menuItems = (<React.Fragment>
    <Menu.Item header>{title}</Menu.Item>
    {tabMenuItems.map((menuItem, index) => (
      <Menu.Item key={index}
        index={index} active={ActiveIndex === index}
        onClick={handelMenuItemClick} icon
      ><Icon name='table'></Icon>
        {menuItem.name}
      </Menu.Item>
    ))}
    <Divider horizontal><Header as='h6'>Links</Header></Divider>
    {linkMenuItems.map((menuItem, index) => (
      <Menu.Item key={index} icon as='a' href={menuItem.href} target='__blank'>
        <Icon name='external alternate'></Icon>
        {menuItem.name}
      </Menu.Item>
    ))}
  </React.Fragment>);

  const tabPanel = (<Grid>
    {tabMenuItems.map((menuItems, index) =>
      <Grid.Column key={index} className={(ActiveIndex === index) ? '' : 'hidden'}>
        {menuItems.panel}
      </Grid.Column>
    )}
  </Grid>);

  return (<Grid>
    <Grid.Row columns={1} only='mobile tablet'>
      <Sidebar.Pushable as={Grid.Column} className='mobile-sidebar-container'>
        <Sidebar
          as={Menu} vertical animation='overlay' color='blue'
          onHide={() => setMobileSidebarVisible(false)} visible={mobileSidebarVisible}
        >{menuItems}
        </Sidebar>
        <Sidebar.Pusher dimmed={mobileSidebarVisible}>
          <Menu borderless compact fixed='left' size='small' inverted color='blue'>
            <Menu.Item
              className='mobile-sidebar-toggle'
              onClick={() => setMobileSidebarVisible(true)}
            ><Icon fitted name='sidebar'></Icon>
            </Menu.Item>
          </Menu>
          {tabPanel}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </Grid.Row>
    <Grid.Row columns={1} only='computer'>
      <Sidebar.Pushable as={Grid.Column} className='computer-sidebar-container'>
        <Menu vertical fixed='left' pointing secondary color='blue'
        >{menuItems}
        </Menu>
        <Sidebar.Pusher>
          {tabPanel}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </Grid.Row>
  </Grid>);
}

export default TabSidebar;
