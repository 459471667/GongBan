import React from 'react';
import {Form, Layout} from 'antd';
import './OrgAdd.less';
import OrgAddForm from "../../../components/Admin/OrgAddForm";

class OrgAdd extends React.Component {

    render() {
        const WrappedOrgAddForm = Form.create()(OrgAddForm);
        const containerStyle = {
            backgroundColor: "white",
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingBottom: "10px"
        };
        return (
            <Layout style={containerStyle} className="org-add">
                <h3>添加单位</h3>
                <WrappedOrgAddForm/>
            </Layout>
        );
    }
}

export default OrgAdd;
