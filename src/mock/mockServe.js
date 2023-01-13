//引入mockjs模块
import Mock from 'mockjs';

//引入JSON数据格式（JSON数据格式没有对外暴露，但是可以引入）
//webpack默认对外暴露，不用单独写暴露：图片，JSON数据格式
import banner from './banner.json';
import floor from './floor.json';

//模拟数据:第一个参数：请求的地址，  第二个参数：请求的数据
Mock.mock("/mock/banner", { code: 200, data: banner });
Mock.mock('/mock/floor', { code: 200, data: floor });