//本文件是对axios的二次封装，用于对mock虚拟数据发请求
import axios from 'axios';

//引入进度条：start进度条开始,done进度条结束
import nprogress from 'nprogress';
//引入进度条样式
import 'nprogress/nprogress.css';


//1.利用axios对象的方法create，创建一个axios实例
const requests = axios.create({
    //配置对象
    baseURL: '/mock',  //基础路径，发请求时路径中的/mock
    timeout: 5000  //代表请求超时的时间为5s
});

//2.请求拦截器：在发请求之前，请求拦截器可以检测到，可以在请求发出去之前做一些事情
requests.interceptors.request.use((config) => {
    //config:配置对象，对象里面有一个属性很重要，headers请求头
    nprogress.start(); //进度条开始
    return config;
});

//3.响应拦截器
requests.interceptors.response.use(
    (res) => {
        //成功的回调函数，服务器响应数据回来以后，响应拦截器可以检测到，可以做一些事情
        nprogress.done(); //进度条结束
        return res.data;
    },
    (error) => {
        //响应失败的回调函数
        return Promise.reject(new Error('faile'));
    });

export default requests;