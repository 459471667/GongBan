import React from 'react';
import {Form, Layout, message} from 'antd';
import StudentEditForm from "../../../components/Admin/StudentEditForm";
import './ClassAdd.less';
import {$axios, navPage} from "../../../utils";

class StudentEdit extends React.Component {

    student_id = '';
    state = {
        fields: {},
        grade_list: [],
        class_list: []
    };

    componentDidMount() {
        this.student_id = this.props.match.params.student_id;
        if (!this.student_id) {
            message.error('不存在的学生');
            navPage('/admin/school_manage/student_list');
            return;
        }
        this.getGradeList();
        $axios('/Eduunit/Student/studentDetail', {student_id: this.student_id}).then(data => {
            if (!data) return;
            if (data.ret_code === '0000000' && data.ret_data) {
                // 
                this.setState({fields: data.ret_data});
                this.getClassList(data.ret_data.grade_code);
            }
        });
    }

    getGradeList = () => {
        $axios('/Eduunit/EduunitClass/grade_list').then(data => {
            if (!data) return;
            if (data.ret_code === '0000000' && data.ret_data.grade_list) {
                this.setState({grade_list: data.ret_data.grade_list});
            }
        });
    };

    getClassList = (grade_code) => {
        $axios('/Eduunit/Student/getClass', {grade_code: grade_code}).then(data => {
            if (!data) return;
            if (data.ret_code === '0000000' && data.ret_data) {
                this.setState({class_list: data.ret_data});
            }
            if (data.ret_code === '6003' && data.ret_data) {
                this.setState({class_list: data.ret_data});
            }
        });
    };

    handleClassChange = (value) => {
        this.setState({fields: {...this.state.fields, class_id: value}});
    };

    handleGradeChange = (value) => {
        this.setState({fields: {...this.state.fields, grade_code: value, class_id: ''}});
        this.getClassList(value);
    };

    render() {
        const {fields, grade_list, class_list} = this.state;
        const {student_phone} = fields;
        const WrappedStudentEditForm = Form.create({
            mapPropsToFields(props) {
                // 已经存在的数据渲染到form item
                return {
                    student_name: Form.createFormField({
                        ...props.student_name,
                        value: props.student_name,
                    }), student_sex: Form.createFormField({
                        ...props.student_sex,
                        value: props.student_sex,
                    }), student_no: Form.createFormField({
                        ...props.student_no,
                        value: props.student_no,
                    }), grade_code: Form.createFormField({
                        ...props.grade_code,
                        value: props.grade_code,
                    }), class_id: Form.createFormField({
                        ...props.class_id,
                        value: props.class_id,
                    }), student_phone: Form.createFormField({
                        ...props.student_phone,
                        value: props.student_phone,
                    }), student_remark: Form.createFormField({
                        ...props.student_remark,
                        value: props.student_remark,
                    })
                };
            }
        })(StudentEditForm);
        const containerStyle = {
            backgroundColor: "white",
            paddingLeft: "20px",
            paddingRight: "20px"
        };
        return (
            <Layout className="class-add" style={containerStyle}>
                <h3>编辑学生</h3>
                <WrappedStudentEditForm {...fields} grade_list={grade_list} class_list={class_list}
                                        student_phone={student_phone}
                                        studdent_id={this.student_id} onClassChange={this.handleClassChange}
                                        onGradeChange={this.handleGradeChange}/>
            </Layout>
        );
    }
}

export default StudentEdit;
