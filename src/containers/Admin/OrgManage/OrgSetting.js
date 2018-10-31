import React, {Component} from 'react';
import {Button, Layout, Modal, Input, message} from "antd";
import {$upgradeUrl, navPage} from "../../../utils";
import './OrgSetting.less';

const { Content} = Layout;

class OrgSetting extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            code:'',
            Vcode : []
        }
    }
    
    showModal = () => {
        setTimeout(() => {
            this.drawCode();
        },100)
        this.setState({
          visible: true,
          code:''
        });
    }

    //确认升年级
    handleOk = (e) => {
        let userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (this.state.code == this.state.Vcode) {
            message.loading('处理中，请稍等...', 0 );
            this.setState({
                visible: false,
            });
            this.gradeChange(userInfo.user_no);

            console.log('userInfo:',userInfo);
            
            
        }
        else if (this.state.code ==""){
            message.info('请输入验证码！', 1);
        }
        else {
            this.drawCode();
            message.info('验证码不正确！', 1);
            this.setState({
                code:''
              });
        }
    }

    gradeChange = (user_no) =>{
        const upUrl = $upgradeUrl();
        const fetUrl=upUrl+'/User/Index/upgradeclass.html?user_no='+user_no;
        console.log('请求地址：',fetUrl);
        
        fetch(fetUrl)
        .then((res) => res.json())
        .then(data => {   
            console.log('data:',data);
                   
            if (!data) return;
            if (data.ret_code === '001') {
                message.destroy();
                message.success(data.ret_msg, 2.0)
            }else if(data.ret_code === '002'){
                message.destroy();
                message.info(data.ret_msg, 2.0);
            }
        })
        .catch(err => console.log("error:", err))

    }
    
    handleCancel = (e) => {
        this.setState({
          visible: false,
        });
        message.info('操作取消',1);
    }

    handleInput = (e) => {
        this.setState({code: e.target.value});
    };

    //验证码画布
    drawCode = () =>{
        var show_num = [];
        var canvas = document.getElementById("canvas");//获取到canvas的对象
        var canvas_width=100;
        var canvas_height=28;
        var context = canvas.getContext("2d");//获取到canvas画图的环境
        canvas.width = canvas_width;
        canvas.height = canvas_height;
        
        var sCode = "A,B,C,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0";
        var aCode = sCode.split(",");
        var aLength = aCode.length;//获取到数组的长度

        for (var i = 0; i <= 3; i++) {
            var j = Math.floor(Math.random() * aLength);//获取到随机的索引值
            var deg = Math.random() * 30 * Math.PI / 180;//产生0~30之间的随机弧度
            var txt = aCode[j];//得到随机的一个内容
            show_num[i] = txt.toLowerCase();
            var x = 10 + i * 20;//文字在canvas上的x坐标
            var y = 20 + Math.random() * 8;//文字在canvas上的y坐标
            context.font = "bold 23px 微软雅黑";

            context.translate(x, y);
            context.rotate(deg);

            context.fillStyle = this.randomColor();
            context.fillText(txt, 0, 0);

            context.rotate(-deg);
            context.translate(-x, -y);
        }
        for (var i = 0; i < 5; i++) { //验证码上显示线条
            context.strokeStyle = this.randomColor();
            context.beginPath();
            context.moveTo(Math.random() * canvas_width, Math.random() * canvas_height);
            context.lineTo(Math.random() * canvas_width, Math.random() * canvas_height);
            context.stroke();
        }
        for (var i = 0; i <= 30; i++) { //验证码上显示小点
            context.strokeStyle = this.randomColor();
            context.beginPath();
            var x = Math.random() * canvas_width;
            var y = Math.random() * canvas_height;
            context.moveTo(x, y);
            context.lineTo(x + 1, y + 1);
            context.stroke();
        }
        this.setState({
            Vcode:show_num.join('')
        })
    }

    //得到随机的颜色值
    randomColor = () => {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    render() {
        const containerStyle = {
            backgroundColor: "white",
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingBottom: "10px"
        };
        const inputStyle={
            borderRadius:"3px",
            height:"30px",
            width:"80px"
        };
        const changeCode={
            color:'#4082c9',
            fontSize:'12px',
            textDecoration: 'underline',
            cursor:'pointer'
        }
        const codeStyle ={
            display: "flex",
            alignItems:"center",
        }  
           
        return (
            <Layout  style={containerStyle}>
                <Content className="org-set-content">
                    <div className="set-top"><span className="set-top-title">升学管理</span></div>
                    <div className="set-centen"><label className="set-centen-title">学生升年级</label><Button type="primary" onClick={this.showModal} >升年级</Button></div>
                    <Modal
                        title="确认提示"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        width={442}
                        height={230}
                        bodyStyle={{borderTop: '1px solid #e8e8e8',height:'105px'}}
                        >
                        <div style={{marginLeft:25,fontSize:14}}>
                            <p>确认要升年级吗？<span style={{color:'#f54242'}}>（该操作不可逆，请谨慎操作！）</span></p>
                            <div style={codeStyle}>
                                <label>图形验证码</label>
                                <span style={{color:'#f54242',marginLeft:10,marginRight:5}}>*</span>
                                <Input style={inputStyle} value={this.state.code} onChange={this.handleInput} />
                                <canvas id="canvas" width="100" height="28"></canvas>         
                                <label  style={changeCode} onClick={()=>{ this.drawCode()}}>换一换</label>
                            </div>
                        </div>
                    </Modal>
                    <div className="set-botton">
                        <div style={{marginTop:"30px",marginLeft:"30px"}}>
                            <label>说明：</label>
                            <ol>
                                <li><p>操作升年级之后，本教育局下属的所有学校的学生都升一个年级。</p></li>
                                <li>六年级的学生小学毕业，账号不再显示；一至五年级的学生，升一个年级，举例说明：一年级1班升至二年级1班，二年级1班升至三年级1班，
                                <p>二年级2班升至三年级2班，以此类推。</p></li>
                                <li>请在每年的8月30日之前操作升年级。</li>
                            </ol>
                        </div>
                    </div>
                </Content>  
            </Layout>
        );
    }
}

export default OrgSetting;