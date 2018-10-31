import React from "react";
import  "./BookListStyle/BookListStyle.less";
import {Layout,Menu} from "antd";
import {Link, NavLink, Route, Switch} from "react-router-dom";
import BookListComponent from "../BookListComponent/BookListComponent"; 
import BookDetailIndex from "../BookOrderDetail/BookDetailIndex";

export default class BookListIndex extends React.PureComponent{
        constructor(props){
        	super(props);
        	this.state={};
        };
        render(){
        	return <Layout style={{flexDirection: 'row'}}>
                      <div style={{width:"158px",display:"flex",flexDirection:"column"}}>
                        <Layout style={{position:"fixed"}}>
                          <Menu
                             mode="inline"
                             selectedKeys={["/admin/book_manage/book_list"]}
                             style={{height: '100%', width: 158}}
                             className="menu-item-custom"
                           >
                            <Menu.Item key="/admin/book_manage/book_list">
                    	       <NavLink to="/admin/book_manage/book_list">图书订单</NavLink>
                            </Menu.Item>
                          </Menu>
                        </Layout>
                       </div>
                       <Switch>
                          <Route path="/admin/book_manage/book_list" component={BookListComponent}/>
                          <Route path="/admin/book_manage/book_order_detail/:bookOrderId" component={BookDetailIndex}/>
                        </Switch>
                    </Layout>
        }
};