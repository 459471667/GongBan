import React from "react";
import {Redirect, Route, Router, Switch} from "react-router-dom";
import App from "./containers/App/App";
import About from "./containers/App/About";
import Admin from "./containers/Admin/Admin";
import {history} from './utils/history';
import Login from "./Login";
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {LocaleProvider} from "antd";

/**
 * root routes
 * @returns {*}
 */
export default () => {
    return (
        <LocaleProvider locale={zhCN}>
            <Router history={history}>
                <Switch>
                    <Route exact path="/" render={() => <Redirect to="/admin/index"/>}/>
                    <Route path="/app" component={App}/>
                    <Route path="/about" component={About}/>
                    <Route path="/login" component={Login}/>
                    <PrivateRoute path="/admin" component={Admin}/>
                </Switch>
            </Router>
        </LocaleProvider>
    )
}

export const PrivateRoute = ({component: Admin, ...rest}) => (
    <Route {...rest} render={props => (
        localStorage.getItem('userInfo')
            ? <Admin {...props} />
            : <Redirect to={{pathname: '/login', state: {from: props.location}}}/>
    )}/>
);
