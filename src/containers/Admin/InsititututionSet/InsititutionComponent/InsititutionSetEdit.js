import React from "react";
import { Form, Icon, Input, Button, Upload,Layout,Modal,Message,Cascader} from 'antd';
import axios from 'axios';
import "../InsititutionStyle/InsititutionLess.less";
import {NavLink} from "react-router-dom"; 
const FormItem = Form.Item;
class InisititionSetEdit extends React.PureComponent{
	constructor(props){
		super(props);
		this.state={
			loc_options: [],
			certificateAntiSrc:"",
			certificateAntiSrcFront:"",
			businessLicensePicSrc:"",
			loadingBusiness:false,
			loadingCertificateOne:false,
			loadingCertificateTwo:false,
			loadingOne:false,
			loadingTwo:false,
			loadingThree:false,
			businessErrorText:" ",
			storePicLoadingOne:false,
			storePicLoadingTwo:false,
			storePicLoadingThree:false,
			storePicSrcOne:"",
			storePicSrcTwo:"",
			storePicSrcThree:""
		};
		this.handleSubmit=this.handleSubmit.bind(this);
		this.abordSubmit=this.abordSubmit.bind(this);
		this.handleCertificateImgChange=this.handleCertificateImgChange.bind(this);
		this.handleCertificateImgChangeFront=this.handleCertificateImgChangeFront.bind(this);
		this.handleBusinessPicChange=this.handleBusinessPicChange.bind(this);
		this.handleStorePicUploadOne=this.handleStorePicUploadOne.bind(this);
		this.handleStorePicUploadTwo=this.handleStorePicUploadTwo.bind(this);
		this.handleStorePicUploadThree=this.handleStorePicUploadThree.bind(this);
		this.loadLocationData=this.loadLocationData.bind(this);
		this.onLocationChange=this.onLocationChange.bind(this);
		this.getLocationData=this.getLocationData.bind(this);
	}

	// 处理antd的bug
	// 营业执照照片
	certificatePics=[{frontPic:""},{backPic:""}];

	// 门店照片
	storePics=[{storePicOne:""},{storePicTwo:""},{storePicThree:""}];

	selectedLoc={};


	abordSubmit(proxyObj){
		proxyObj.preventDefault();
		const {history} = this.props;
		history.push("/admin/org_manage/org_list");
	}

	checkCerticatePicks(certificatePics){
		return certificatePics.some((elObj)=>{
			return elObj[Object.keys(elObj)[0]]==="";
		})?undefined:certificatePics;
	}

	checkStorePicks(storePics){
		return storePics.every((elObj)=>{
			return elObj[Object.keys(elObj)[0]]==="";
		})?undefined:storePics;
	}

	handleSubmit(proxyObj){
		proxyObj.persist();
		proxyObj.preventDefault();
		let fieldsValue=this.props.form.getFieldsValue();
		// 获取form表单全部的值
		let {businessPic} = fieldsValue;
		if(!businessPic||businessPic.trim()===""){
			// 处理antd form表单的bug
			console.log(this.props.form.getFieldsValue());
			this.setState({businessErrorText:"请上传营业执照"},()=>{
				this.props.form.validateFields((err, values) => {
      				if(Object.keys(fieldsValue).some((key)=>{
						return  !fieldsValue[key];
					})){
						Message.error("请根据信息重新填写或上传。");
						return;
					}
      				// 提交数据
        			console.log(values,"this is values");
    			});
			});
		}else{
			this.props.form.validateFields((err, values) => {
      			if(Object.keys(fieldsValue).some((key)=>{
						return  !fieldsValue[key];
					})){
						Message.error("请根据信息重新填写或上传。");
						return;
					}
      			// 提交数据
        		console.log(values,"this is values");
    		});
		}
	}

	fetchBusinessPic(e){
		let {fileList} = e;
		if(fileList[0]&&fileList[0]["response"]){
			let picUrl=fileList[0]["response"]["ret_data"]["pic_url"];
			return picUrl;
		};
		return "";
	}

	handleCertificateImgChangeFront(fileData){
		if (fileData.file.status === 'uploading') {
      		this.setState({ loadingCertificateOne: true });
      		return;
    	}
		let {response} = fileData.file;
		if(response&&response.ret_data){
			this.certificatePics[1]=Object.assign(
				this.certificatePics[1],
				{backPic:response.ret_data.pic_url}
			);
			this.props.form.setFieldsValue({certificatePics:this.checkCerticatePicks(this.certificatePics)});
			this.setState({certificateAntiSrcFront:response.ret_data.pic_url});
		}

	}

	handleCertificateImgChange(fileData){
		if (fileData.file.status === 'uploading') {
      		this.setState({ loadingCertificateTwo: true });
      		return;
    	}
		let {response} = fileData.file;
		if(response&&response.ret_data){
			this.certificatePics[0]=Object.assign(
				this.certificatePics[0],
				{frontPic:response.ret_data.pic_url}
			);
			this.props.form.setFieldsValue({certificatePics:this.checkCerticatePicks(this.certificatePics)});
			this.setState({certificateAntiSrc:response.ret_data.pic_url});
		}
	}
	// 处理上传的bug
	handleBusinessPicChange(fileData){
		this.setState({businessErrorText:" "});
		if (fileData.file.status === 'uploading') {
      		this.setState({ loadingBusiness: true });
      		return;
    	}
		let {response} = fileData.file;
		if(response&&response.ret_data){
			this.setState({businessLicensePicSrc:response.ret_data.pic_url});
		}
	}

	// 门店上传
	handleStorePicUploadOne(fileData){
		if (fileData.file.status === 'uploading') {
      		this.setState({ storePicLoadingOne: true });
      		return;
    	}
		let {response} = fileData.file;
		if(response&&response.ret_data){
			this.storePics[0]=Object.assign(
				this.storePics[0],
				{storePicOne:response.ret_data.pic_url}
			);
			this.props.form.setFieldsValue({storePics:this.checkStorePicks(this.storePics)});
			this.setState({storePicSrcOne:response.ret_data.pic_url});
		}
	}

	handleStorePicUploadTwo(fileData){
		if (fileData.file.status === 'uploading') {
      		this.setState({ storePicLoadingTwo: true });
      		return;
    	}
		let {response} = fileData.file;
		if(response&&response.ret_data){
			this.storePics[1]=Object.assign(
				this.storePics[1],
				{storePicTwo:response.ret_data.pic_url}
			);
			this.props.form.setFieldsValue({storePics:this.checkStorePicks(this.storePics)});
			this.setState({storePicSrcTwo:response.ret_data.pic_url});
		}
	}

	handleStorePicUploadThree(fileData){
		if (fileData.file.status === 'uploading') {
      		this.setState({ storePicLoadingThree: true });
      		return;
    	}
		let {response} = fileData.file;
		if(response&&response.ret_data){
			this.storePics[2]=Object.assign(
				this.storePics[2],
				{storePicThree:response.ret_data.pic_url}
			);
			this.props.form.setFieldsValue({storePics:this.checkStorePicks(this.storePics)});
			this.setState({storePicSrcThree:response.ret_data.pic_url});
		}
	};

	onLocationChange (value, selectedOptions) {
			let {form} = this.props;
            this.selectedLoc={};
            let mapLocation=[{code:"user_prov_code",name:"user_prov_name"},
                            {code:"user_city_code",name:"user_city_name"},
                            {code:"user_dist_code",name:"user_dist_name"},{code:"user_stre_code",name:"user_stre_name"}];
            selectedOptions.forEach((elObj,index)=>{
                 this.selectedLoc[mapLocation[index].code]=elObj.value;
                 this.selectedLoc[mapLocation[index].name]=elObj.label;
            });
            form.setFieldsValue({residenceLocation:this.selectedLoc});
            // 地区地址数据
            console.log(this.selectedLoc,"data");
    };

	loadLocationData (selectedOptions)  {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        this.getLocationData(targetOption.value)
            .then((resp) => {
                targetOption.loading = false;
                if (resp.data.status === 0) {
                    let options = [];
                    for (let item of resp.data.data.area) {
                        let {area_code: value, area_name: label, ...rest} = item;
                        if (selectedOptions.length === 3) {
                            // 当已经选第三个option时，子option节点设置为叶子leaf
                            options.push({value, label, isLeaf: true, rest});
                        } else {
                            options.push({value, label, isLeaf: false, rest});
                        }
                    }
                    targetOption.children = options;
                    this.setState({
                        loc_options: [...this.state.loc_options],
                    });
                }
            })
            .catch((error) => {
                targetOption.loading = false;
                console.log(error);
            });
    };

      getLocationData  (loc_code) {
        let params = {
            area_f_code: loc_code,
            method: "LoginSupplier.post_area",
            token: ''
        };
        return axios.post('http://www.doubei365.com/index.php?g=Supplier&m=LoginSupplier&a=post_area', params);
    };

	componentDidMount(){
		this.getLocationData(0)
            .then((locData) => {
                if (locData.data.status === 0) {
                    let options = [];
                    for (let item of locData.data.data.area) {
                        let {area_code: value, area_name: label, ...rest} = item;
                        options.push({value, label, isLeaf: false, rest});
                    }
                    this.setState({
                        loc_options: [...options],
                    });
                }
            });
	}
	render(){
		const { getFieldDecorator,getFieldsError} = this.props.form;
		const {certificateAntiSrc,
			   certificateAntiSrcFront,
			   businessLicensePicSrc,
			   loadingBusiness,
			   loadingCertificateOne,
			   loadingCertificateTwo,
			   loadingOne,
			   loadingTwo,
			   loadingThree,
			   businessErrorText,
			   storePicLoadingOne,
			   storePicLoadingTwo,
			   storePicLoadingThree,
			   storePicSrcOne,
			   storePicSrcTwo,
			   storePicSrcThree}=this.state;
		const formItemLayout = {
      			labelCol: { xs: {span: 16}, sm: {span: 16}},
      			wrapperCol: { xs: {span: 20}, sm: {span: 20}}
    	};
    	const uploadButton =(detail,loading)=>{
    		return  (<div>
        				<Icon type={loading ? 'loading' : 'plus'} />
        				<div className="ant-upload-text">{detail}</div>
      				</div>);
    	};
		return (<Layout className="org-add custom-define-style" style={{width:"350px"}} ><Form  onSubmit={this.handleSubmit}>
					<FormItem
						label="入驻时间:"
						{...formItemLayout}
					>
							{getFieldDecorator("registerTime",{
								rules:[{required:false,message:""}]
							})(<Input style={{width: '417px'}} disabled={true} />)}
					</FormItem>
					<FormItem
						label="审核时间:"
						{...formItemLayout}
					>
						{getFieldDecorator("examineTime",{
							rules:[{required:false,message:""}]

						})(
							<Input style={{width: '417px'}} disabled={true} />
						)}
					</FormItem>
					<FormItem
						label="机构名称:"
						{...formItemLayout}
					>
						{getFieldDecorator("insititutionName",{
							rules:[{required:true,message:"请输入机构名称"}]

						})(
							<Input style={{width: '417px'}} />
						)}
					</FormItem>
					<FormItem
                    	{...formItemLayout}
                    	label="所在地区："
                	>
                    {getFieldDecorator('residenceLocation', {
                        rules: [{type: 'array', required: true, message: '请选择所在地区!'}],
                    })(
                        <Cascader
                            placeholder="请选择"
                            style={{width: '417px'}}
                            options={this.state.loc_options}
                            loadData={this.loadLocationData}
                            onChange={this.onLocationChange}
                            changeOnSelect
                        />
                    )}
                	</FormItem>
					<FormItem
						label="联系人:"
						{...formItemLayout}
					>
						{getFieldDecorator("linkMan",{
							rules:[{required:true,message:"请输入联系人"}]

						})(
							<Input style={{width: '417px'}} />
						)}
					</FormItem>
					<FormItem
						label="手机:"
						{...formItemLayout}
					>
						{getFieldDecorator("phone",{
							rules:[{required:true,message:"请输入手机"}]

						})(
							<Input style={{width: '417px'}} />
						)}
					</FormItem>
					<FormItem
						label="营业执照照片:"
						className="custom-define-img-area"
						{...formItemLayout}
					>
						{getFieldDecorator("businessPic",{
							rules:[{required:true,message:businessErrorText}],
							getValueFromEvent:this.fetchBusinessPic.bind(this)
						})(
								<Upload
										action="http://localhost:8080/index.php/Eduunit/EduunitNews/news_pic"
										name="news_pic"
										className="avatar-uploader-define"
										listType="picture-card"
										showUploadList={false}
										data={{token:localStorage.getItem("token")}}
              							onChange={this.handleBusinessPicChange}>
              							{businessLicensePicSrc?<div style={{width:"200px",height:"125px",overflow:"hidden"}}><img 
              									style={{width:"100%",height:"100%"}}
              									src={businessLicensePicSrc} alt="营业执照照片" /></div>:uploadButton("营业执照上传",loadingBusiness)}
              					</Upload>
						)}
					</FormItem>
					<FormItem
						label="身份证照片:"
						className="custom-define-img-area"
						{...formItemLayout}
					>
						{getFieldDecorator("certificatePics",{
							rules:[{required:true,message:"请上传身份证正反面照片"}]
						})(
							<div className="upload-style-div">
								<div>
									<Upload
										action="http://localhost:8080/index.php/Eduunit/EduunitNews/news_pic"
										name="news_pic"
										className="avatar-uploader-define"
										listType="picture-card"
										showUploadList={false}
										data={{token:localStorage.getItem("token")}}
              							onChange={this.handleCertificateImgChangeFront}>
              							{certificateAntiSrcFront?<div style={{width:"200px",height:"125px",overflow:"hidden"}}><img 
              									style={{width:"100%",height:"100%"}}
              									src={certificateAntiSrcFront} alt="身份证正面头像" /></div>:uploadButton("反面",loadingCertificateOne)}
              						</Upload>
								</div>
								<div>
									<Upload
										action="http://localhost:8080/index.php/Eduunit/EduunitNews/news_pic"
										name="news_pic"
										className="avatar-uploader-define"
										listType="picture-card"
										showUploadList={false}
										data={{token:localStorage.getItem("token")}}
              							onChange={this.handleCertificateImgChange}>
              							{certificateAntiSrc?<div style={{width:"200px",height:"125px",overflow:"hidden"}}><img 
              									style={{width:"100%",height:"100%"}}
              									src={certificateAntiSrc} alt="身份证正面头像" /></div>:uploadButton("正面",loadingCertificateTwo)}
              						</Upload>
								</div>
							</div>
						)}
					</FormItem>
					<FormItem
						label="门店照片:"
						className="custom-define-img-area"
						{...formItemLayout}
					>
						{getFieldDecorator("storePics",{
							rules:[{required:true,message:"请上传至少一张门店照片"}]

						})(
							<div className="upload-style-div">
								<div>
									<Upload
										action="http://localhost:8080/index.php/Eduunit/EduunitNews/news_pic"
										name="news_pic"
										className="avatar-uploader-define"
										listType="picture-card"
										showUploadList={false}
										data={{token:localStorage.getItem("token")}}
              							onChange={this.handleStorePicUploadOne}>
              							{storePicSrcOne?<div style={{width:"200px",height:"125px",overflow:"hidden"}}><img 
              									style={{width:"100%",height:"100%"}}
              									src={storePicSrcOne} alt="门店照片1" /></div>:uploadButton("门店照片1",storePicLoadingOne)}
              						</Upload>
								</div>
								<div>
									<Upload
										action="http://localhost:8080/index.php/Eduunit/EduunitNews/news_pic"
										name="news_pic"
										className="avatar-uploader-define"
										listType="picture-card"
										showUploadList={false}
										data={{token:localStorage.getItem("token")}}
              							onChange={this.handleStorePicUploadTwo}>
              							{storePicSrcTwo?<div style={{width:"200px",height:"125px",overflow:"hidden"}}><img 
              									style={{width:"100%",height:"100%"}}
              									src={storePicSrcTwo} alt="门店照片2" /></div>:uploadButton("门店照片2",storePicLoadingTwo)}
              						</Upload>
								</div>
								<div>
									<Upload
										action="http://localhost:8080/index.php/Eduunit/EduunitNews/news_pic"
										name="news_pic"
										className="avatar-uploader-define"
										listType="picture-card"
										showUploadList={false}
										data={{token:localStorage.getItem("token")}}
              							onChange={this.handleStorePicUploadThree}>
              							{storePicSrcThree?<div style={{width:"200px",height:"125px",overflow:"hidden"}}><img 
              									style={{width:"100%",height:"100%"}}
              									src={storePicSrcThree} alt="门店照片3" /></div>:uploadButton("门店照片3",storePicLoadingThree)}
              						</Upload>
								</div>
							</div>
						)}
					</FormItem>
					<FormItem>
          				<Button
            				type="primary"
            				htmlType="submit"
            				id="submitButton">
            					保存
          				</Button>
          				<NavLink to="/admin/org_set/institution_detail">
          					<Button
            					type="default"
            					style={{marginLeft:"30px"}}>
            					取消
          					</Button>
          				</NavLink>
        			</FormItem>
				</Form></Layout>);
	}
};
export default Form.create()(InisititionSetEdit);
