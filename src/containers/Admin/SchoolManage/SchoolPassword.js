import React, {Component} from 'react';
import {Button, Layout, Form, Input, message} from "antd";
import {$axios} from '../../../utils';
import Loadable from "react-loadable";
import './SchoolPassword.less';

const { Content} = Layout;

const SchoolPassFrom=Loadable({
    loader: () => import("../../../components/Admin/SchoolPassFrom"),
    loading:(props)=>{
        return null;
    }
});

class SchoolPassword extends Component {
    render () {
        
        const containerStyle = {
            backgroundColor: "white",
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingBottom: "10px"
        };

        const WrappedSchoolPassFrom= Form.create()(SchoolPassFrom);

        // console.log('prop:',this.props.match.params.user_id)

        return (
            <Layout  style={containerStyle}>
                <Content className="change-content">
                    <div className="chang-title">
                        <span>修改本单位管理员密码</span>
                    </div>
                    <WrappedSchoolPassFrom user_id={this.props.match.params.user_id} />
                    
                </Content>  
            </Layout>
        );
    }
}
export default SchoolPassword;