webpackJsonp([17],{"/3Lk":function(n,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});a("sbPr");var t=a("7aUU"),r=(a("kOkp"),a("BRBC")),d=a("5AvO"),o=a.n(d),i=a("cj8U"),A=a.n(i),l=a("S0e7"),m=a("NTtZ"),c=a("+C2f"),s=a("tMip"),p=a("VKKs"),h=a("laLp"),u=a("mJEM"),f=a.n(u),g=a("X2Oc");a("7+uW").a.use(r.a);var B={name:"addTeaDeal",components:{FcCell:l.a,FcForm:m.a,FcSubmit:h.a,FcPickInfo:c.a},data:function(){return{teaImg:o.a,infoImg:A.a,addFormRenderList:Object(s.a)(),userData:p.c.getUserData(),formData:{},pickData:{},workId:"",loaded:!1}},beforeRouteEnter:function(n,e,a){var t=p.c.getUserData();if(Object(g.d)(t)){Object(r.a)("请先登录");var d=Object(g.b)(location.href);a(function(n){n.$router.replace({path:"/",query:{workId:d.workId}})})}else a()},created:function(){var n=this;this.workId=this.$route.query.workId||"",this.workId&&(f.a.toDataURL(location.origin+"/#/enterprise/teaDeal/add?workId="+this.workId).then(function(e){n.$set(n.formData,"code",[{img:e}])}),this.getPickData())},methods:{getPickData:function(){var n=this;this.$axios({url:"/teaAction/getWorkRecordByWorkId",method:"GET",data:{workId:this.workId}}).then(function(e){n.loaded=!0,n.pickData=e.data||{}}).catch(function(){})},handleBack:function(){this.$router.back(-1)},handleSubmit:function(){var n=this;this.$refs.FcForm.validateForm().then(function(e){n.$axios({url:"/teaAction/addFarmingSettle",data:{operatePersonId:n.pickData.operatePersonId,workId:n.workId,settlerId:n.userData.userId,weight:e.weight,breedNum:e.breedNum},hideNote:!0}).then(function(e){n.$toast("交易完成"),setTimeout(function(){n.$router.replace({path:"/enterprise/teaDeal/list",query:{type:"add"}})},200)}).catch(function(e){20==e.code?t.a.alert({title:"提示",message:""+e.message}).then(function(){n.$router.replace({path:"/enterprise/teaDeal/list",query:{type:"add"}})}):n.$toast(""+e.message)})})}}},D=function(){var n=this,e=n.$createElement,a=n._self._c||e;return n.loaded?a("FcPage",{attrs:{title:"添加交易"}},[a("div",{staticClass:"addTeaDeal"},[a("div",{staticClass:"addTeaDeal-content"},[a("FcCell",{attrs:{text:"结算信息",isBold:"",icon:n.teaImg}}),n._v(" "),a("div",{staticClass:"addTeaDeal-form"},[a("div",{staticClass:"addTeaDeal-form-line"}),n._v(" "),a("FcForm",{ref:"FcForm",attrs:{renderList:n.addFormRenderList},model:{value:n.formData,callback:function(e){n.formData=e},expression:"formData"}})],1)],1),n._v(" "),a("div",{staticClass:"addTeaDeal-content addTeaDeal-info"},[a("FcCell",{attrs:{text:"采摘信息",isBold:"",icon:n.infoImg}}),n._v(" "),a("div",{staticClass:"addTeaDeal-form"},[a("div",{staticClass:"addTeaDeal-form-line"}),n._v(" "),a("div",{staticClass:"addTeaDeal-pickInfo"},[a("FcPickInfo",{attrs:{data:n.pickData}})],1)])],1),n._v(" "),a("FcSubmit",{on:{back:n.handleBack,submit:n.handleSubmit}})],1)]):n._e()};D._withStripped=!0;var C={render:D,staticRenderFns:[]},b=C;var k=!1;var I=a("VU/8")(B,b,!1,function(n){k||a("hPpW")},"data-v-35d9d396",null);I.options.__file="src/pages/enterprise/app/teaDeal/add.vue";e.default=I.exports},"5AvO":function(n,e){n.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAAgVBMVEUAAABjnIlbm4dim4hinIhim4him4hhm4him4him4him4hinIlinIhim4hjm4henYVgnoZim4him4hinIljnIhim4him4hinIhhm4hinIhhnIhim4him4hinIhjnIhjnIljnIhknIphnIhim4him4hinIhinIhim4lim4ljnIpim4hU9QxNAAAAKnRSTlMAFwn5bOnb9eLSy7eOh08SDu+jYzTAu7I9KxuslXVZSUIgmn5yXlTEnSTA/T0CAAABb0lEQVQoz3WS17qCMBCEA0novSMoUixn3v8BTwoo+mFuSPh3NzuTJb/Xtf7NYuYC7TE75RUFUpwPWDF7ALzlxOB/oeSeccnOo4xD+gGjmgL0sYz6aNLd5ebiCObnxjvcwm3bMg6Ut+SjWoVwbccDnf6+m3xCK88pstPu/6VRnxCu/ARwhh1sfU3JAq6DjH2qu93CYAs5sAR91Q7E6YVBTAey1jPW8ro3JWfhS66tC5TEpLSlE0Zk6J4s4uOiCk3ymTx0Td4/Ql2hFpkcysPGEkkuQN3pbq7FU8yEQp1ijIJ6V3M3DkArQnRTvLPgKFM3GSUqQly0q8FAr9oKQoUZaEFIhlzhXmBn8h07K7Q7AJN+o1tFSt5HptYfaEpi21Y3zgLet6FhHHx9hlBPnIcq0YlRZgPdZl7MU7EtYEnazCUFhMC3vgGlKc0TaSnEsoJiJVv5egACDthlqO3+GipZkfeDSY7WKPKyK/m5ahYfg38QsiFwtAXlmAAAAABJRU5ErkJggg=="},Lrpz:function(n,e,a){(n.exports=a("FZ+f")(!0)).push([n.i,"\n.addTeaDeal[data-v-35d9d396]{position:relative;min-height:100%;padding:0.3rem 0.3rem 2.2rem;background-color:#f5f5f5\n}\n.addTeaDeal .addTeaDeal-content[data-v-35d9d396]{background-color:#fff\n}\n.addTeaDeal .addTeaDeal-content[data-v-35d9d396] .title-text{color:#629b88\n}\n.addTeaDeal .addTeaDeal-content[data-v-35d9d396] .upload{padding-top:0.18rem\n}\n.addTeaDeal .addTeaDeal-content[data-v-35d9d396] .upload-content{-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;border-bottom:1px solid #eeeeee\n}\n.addTeaDeal .addTeaDeal-content[data-v-35d9d396] .upload-content .formItem-label{padding-top:0.14rem\n}\n.addTeaDeal .addTeaDeal-content[data-v-35d9d396] .upload-content .formItem-content{-webkit-box-flex:1;-ms-flex:auto;flex:auto;-webkit-box-pack:end;-ms-flex-pack:end;justify-content:flex-end\n}\n.addTeaDeal .addTeaDeal-content[data-v-35d9d396] .upload-content .formItem-content .formItem-content-item{padding:0\n}\n.addTeaDeal .addTeaDeal-content[data-v-35d9d396] .upload-content .formItem-content .formItem-uploader{width:0.64rem;height:0.64rem;padding:0;background-color:transparent\n}\n.addTeaDeal .addTeaDeal-content[data-v-35d9d396] .upload-content .formItem-content .formItem-uploader>img{width:0.64rem !important;height:0.64rem !important\n}\n.addTeaDeal .addTeaDeal-content[data-v-35d9d396] .upload-content .formItem-content .formItem-uploader-delete{display:none !important\n}\n.addTeaDeal .addTeaDeal-content .addTeaDeal-form-line[data-v-35d9d396]{margin:0 0.3rem;height:1px;background-color:#eee\n}\n.addTeaDeal .addTeaDeal-content .addTeaDeal-pickInfo[data-v-35d9d396]{padding:0.18rem 0.3rem 0\n}\n.addTeaDeal .addTeaDeal-info[data-v-35d9d396]{margin-top:0.2rem\n}\n.addTeaDeal .addTeaDeal-bottom[data-v-35d9d396]{position:fixed;bottom:0.8rem;left:0.3rem;right:0.3rem;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between\n}\n.addTeaDeal .addTeaDeal-bottom>div[data-v-35d9d396]{width:3.1rem;height:0.8rem;border-radius:0.08rem;border-width:1px;border-style:solid;text-align:center;line-height:0.76rem\n}\n.addTeaDeal .addTeaDeal-bottom .addTeaDeal-back[data-v-35d9d396]{border-color:#e1e1e1\n}\n","",{version:3,sources:["D:/FuChuang/xicha-webapp/src/pages/enterprise/app/teaDeal/D:/FuChuang/xicha-webapp/src/pages/enterprise/app/teaDeal/add.vue"],names:[],mappings:";AAoLA,6BACI,kBACA,gBACA,6BACA,wBAAyB;CAJ7B;AAAA,iDAMQ,qBAAsB;CAN9B;AAAA,6DAQY,aAAc;CAR1B;AAAA,yDAWY,mBAAoB;CAXhC;AAAA,iEAcY,yBAAA,sBAAA,8BACA,+BAAgC;CAf5C;AAAA,iFAiBoB,mBAAoB;CAjBxC;AAAA,mFAoBgB,mBAAA,cAAA,UACA,qBAAA,kBAAA,wBAAyB;CArBzC;AAAA,0GAuBoB,SAAU;CAvB9B;AAAA,sGA0BoB,cACA,eACA,UACA,4BAA6B;CA7BjD;AAAA,0GAiCwB,yBACA,yBAA0B;CAlClD;AAAA,6GAsCoB,uBAAwB;CAtC5C;AAAA,uEA2CY,gBACA,WACA,qBAAsB;CA7ClC;AAAA,sEAgDY,wBAAyB;CAhDrC;AAAA,8CAqDQ,iBAAkB;CArD1B;AAAA,gDAyDQ,eACA,cACA,YACA,aACA,oBAAA,oBAAA,aACA,8BAAA,6BAAA,uBAAA,mBACA,yBAAA,sBAAA,6BAA8B;CA/DtC;AAAA,oDAiEY,aACA,cACA,sBACA,iBACA,mBACA,kBACA,mBAAoB;CAvEhC;AAAA,iEA0EY,oBAAqB;CACxB",file:"add.vue",sourcesContent:["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\r\n.addTeaDeal {\r\n    position: relative;\r\n    min-height: 100%;\r\n    padding: 0.3rem 0.3rem 2.2rem;\r\n    background-color: #f5f5f5;\r\n    .addTeaDeal-content {\r\n        background-color: #fff;\r\n        /deep/ .title-text {\r\n            color: #629b88;\r\n        }\r\n        /deep/ .upload {\r\n            padding-top: 0.18rem;\r\n        }\r\n        /deep/ .upload-content {\r\n            justify-content: space-between;\r\n            border-bottom: 1px solid #eeeeee;\r\n            .formItem-label {\r\n                    padding-top: 0.14rem;\r\n                }\r\n            .formItem-content {\r\n                flex: auto;\r\n                justify-content: flex-end;\r\n                .formItem-content-item {\r\n                    padding: 0;\r\n                }\r\n                .formItem-uploader {\r\n                    width: 0.64rem;\r\n                    height: 0.64rem;\r\n                    padding: 0;\r\n                    background-color: transparent;\r\n                }\r\n                .formItem-uploader {\r\n                    > img {\r\n                        width: 0.64rem !important;\r\n                        height: 0.64rem !important;\r\n                    }\r\n                }\r\n                .formItem-uploader-delete {\r\n                    display: none !important;\r\n                }\r\n            }\r\n        }\r\n        .addTeaDeal-form-line {\r\n            margin: 0 0.3rem;\r\n            height: 1px;\r\n            background-color: #eee;\r\n        }\r\n        .addTeaDeal-pickInfo {\r\n            padding: 0.18rem 0.3rem 0;\r\n        }\r\n    }\r\n\r\n    .addTeaDeal-info {\r\n        margin-top: 0.2rem;\r\n    }\r\n\r\n    .addTeaDeal-bottom {\r\n        position: fixed;\r\n        bottom: 0.8rem;\r\n        left: 0.3rem;\r\n        right: 0.3rem;\r\n        display: flex;\r\n        flex-direction: row;\r\n        justify-content: space-between;\r\n        > div {\r\n            width: 3.1rem;\r\n            height: 0.8rem;\r\n            border-radius: 0.08rem;\r\n            border-width: 1px;\r\n            border-style: solid;\r\n            text-align: center;\r\n            line-height: 0.76rem;\r\n        }\r\n        .addTeaDeal-back {\r\n            border-color: #e1e1e1;\r\n        }\r\n    }\r\n}\r\n"],sourceRoot:""}])},cj8U:function(n,e){n.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAAaVBMVEUAAABjnIdjnIljnIlim4lkmoVjnIlim4him4hhm4him4lhmohbnIxim4ljm4him4hinIlfm4dim4hinIhhm4hemYRim4hinIhhm4linIhjnIhjnIhim4hjnIdinYhkm4himohinodim4iQsordAAAAInRSTlMAJFC4lxk20GL27BMF/NV0oTPIfmkP8d+ukImFSkMraVYi65USgwAAAMNJREFUKM+Vk1kOgyAURamogOA81qHD3f8iC/1pHhGrJ3yQnPCGkMtqkSNALmpW4ICCAd0twBOwOmIBotNap4Se6j4DYaTajFQLoq1PCObaaDImvKjWoCjv9cIJ5ZXelLf2teGZ41szUY2vewUHZ5Y7sPrFU+lI7O2hBjR6v3cpFFByIGu2HW0FX8wtFkC5o7XAZOx0BapfcepXN10c2LvC1soWMqAFFOyZA1phaKscU0DHs7a7V/Lkl4Rj0AH/QnQcwQ/aRyzx+x28QAAAAABJRU5ErkJggg=="},hPpW:function(n,e,a){var t=a("Lrpz");"string"==typeof t&&(t=[[n.i,t,""]]),t.locals&&(n.exports=t.locals);a("rjj0")("cf5cc0bc",t,!1,{})},tMip:function(n,e,a){"use strict";a.d(e,"a",function(){return t}),a.d(e,"b",function(){return r});var t=function(){return[{label:"茶园工码",placeholder:"",type:"upload",key:"code",required:!0},{label:"茶叶品级",placeholder:"请填写茶叶品级",type:"input",key:"breedNum",required:!0},{label:"茶青重量",placeholder:"请填写茶青重量",type:"input",key:"weight",required:!0,suffixText:"kg",inputType:"float"}]},r=function(){return[{label:"收购重量",key:"weight",unit:"kg"},{label:"收购单数",key:"count",unit:""}]}}});
//# sourceMappingURL=17.03c103560276de181920.js.map