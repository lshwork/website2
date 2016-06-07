
var env = process.env.NODE_ENV || 'development';

console.log('env:', env);
console.log('reload');

var basePath=__dirname;
module.exports = {
    database: 'mongodb://localhost/website',
    basePath:basePath,
    upload:basePath+"\\public\\upload",
    menus:[
        {
            parentName:"关于德天",
            sons:[
                {
                    name:"德天介绍",
                    shorthand:"about"
                },
                {
                    name:"企业文化",
                    shorthand:"culture"
                },
                {
                    name:"董事长致辞",
                    shorthand:"chairman"
                },
                {
                    name:"团队介绍",
                    shorthand:"team"
                },
                {
                    name:"德天事迹",
                    shorthand:"deeds"
                },
            ]
        },
        {
            parentName:"德天版图",
            sons:[
                {
                    name:"战略规划",
                    shorthand:"territory"
                },
                {
                    name:"集团架构",
                    shorthand:"framework"
                },
                {
                    name:"产业布局",
                    shorthand:"industry"
                }
            ]
        },
        {
            parentName:"集团业务",
            sons:[
                {
                    name:"体育赛事运营",
                    shorthand:"operate"
                },
                {
                    name:"体育服务",
                    shorthand:"service"
                },
                {
                    name:"体育营销",
                    shorthand:"marketing"
                },
                {
                    name:"体育传媒",
                    shorthand:"media"
                }
            ]
        },
        {
            parentName:"联系我们",
            sons:[
                {
                    name:"联系我们",
                    shorthand:"contact"
                }
            ]
        }
    ]
};
