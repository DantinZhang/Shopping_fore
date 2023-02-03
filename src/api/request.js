//本文件是对axios的二次封装，用于对真正的服务器发请求
import axios from 'axios';

//引入进度条：start进度条开始,done进度条结束
import nprogress from 'nprogress';
//引入进度条样式
import 'nprogress/nprogress.css';
//引入仓库，查看是否有游客id
import store from '@/store'


//1.利用axios对象的方法create，创建一个axios实例
const requests = axios.create({
    //配置对象
    baseURL: '/api',  //基础路径，发请求时路径中的api
    timeout: 5000  //代表请求超时的时间为5s
});

//2.请求拦截器：在发请求之前，请求拦截器可以检测到，可以在请求发出去之前做一些事情
requests.interceptors.request.use((config) => {
    //config:配置对象，对象里面有一个属性很重要，headers请求头
    // console.log('请求拦截器成功的回调', config);
    //添加请求头，携带临时游客id
    config.headers.token = localStorage.getItem('token');
    // console.log('仓库长这样：',store);
    //这个请求头的名字是和后端约定好的，后端约定这个字段就代表临时游客
    config.headers.userTempId = store.state.detail.userTempId;
    nprogress.start(); //进度条开始
    return config;  //检查完再把东西还给人家
});

//3.响应拦截器
requests.interceptors.response.use(
    (res) => {
        // console.log('响应拦截器成功的回调执行了，响应对象是：', res);
        //成功的回调函数，服务器响应数据回来以后，响应拦截器可以检测到，可以做一些事情
        nprogress.done(); //进度条结束
        return res.data;//检查完把东西还给人家，并加工一下，直接把.data给Promise结果值
    },
    (error) => {
        // console.log('响应拦截器失败的回调执行了');
        alert(error);
        //响应失败的回调函数，返回值和then的规则一样
        //若返回非Promise则走成功的回调，返回Promise则根据状态决定
        return Promise.reject(error);
        // 如果返回pending的Promise，那么错误就可以直接在这里捕获
        // return new Promise(()=>{});  
    });

export default requests;



//取消请求的练习
// let cancel;
// 发请求的按钮.onclick = () => {
//     if(cancel) calcel('取消了'); //用户反复点击，只发送最后一次请求
//     axios({
//         url: 'www.zzy.com',
//         cancelToken: new CancelToken(c => {
//             cancel = c;  //c是一个函数，调用c就会取消请求
//         })
//     }).then(res => {
//         console.log('成功',res)
//     }, err => {
//         if(isCancel(err)) {
//             console.log('用户取消了请求',err.message);
//         }else {
//             console.log('请求失败',err);
//         }

//     });
// }

// 关闭请求的按钮.onclick = () => {
//     cancel('取消了');
// }


//取消请求放拦截器里
// let cancel;
// axios.interceptors.request.use(config => {
//     if(cancel) cancel('取消了');
//     config.cancelToken = new CancelToken(c => {
//         cancel = c;
//     })
//     return config;
// });

// axios.interceptors.response.use(res => {
//     return res.data;
// }, err => {
//     if(isCancel(err)) {
//         console.log('用户取消了请求，原因是',err.message);
//     } else {
//         console.log('请求失败',err);
//     }
//     return new Promise(() => {});
// })

// 发请求的按钮.onclick = async() => {
//     let result = await axios.get('www.zzy.com');
//     console.log(result);
// }