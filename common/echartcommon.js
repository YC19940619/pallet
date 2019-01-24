var datastyle = function(){}
datastyle.prototype = {
    piedata:function(title) {
        return {
            title: {
                text: title,
                left: 'center',
                top: 0,
                textStyle: {
                    color: '#389dbb'
                }
            },

            color:["#2409ee","#2c59e6","#00cae2"],
            tooltip: {
                show: true,
                formatter: "{a}<br/>{b} : {c} ({d}%)"
            },
            series: [
                {
                    name: title,
                    type: 'pie',
                    center:['50%','60%'],
                    radius: ['50%','30%'],
                    data:[],
                    label: {
                        textStyle: {
                            color: 'rgba(255, 255, 255, 1)'
                        },
                        formatter: function(v){
                            var text =  v.name+' : '+v.value+'('+Math.round(v.percent)+'%)'
                            return text.split(":")[0]+':\n'+text.split(":")[1];
                        },
                        fontSize:12
                    },
                    labelLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 1)'
                        },
                        smooth: 0.2,
                        length: 20,
                        length2: 20
                    },
                    itemStyle: {
                        shadowBlur: 200,
                        shadowColor: 'rgba(255, 255, 255, 0.5)'
                    },

                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 200;
                    }
                }
            ]
        }
    },
    bardata:function(title) {
        return {
            title: {
                text: title,
                left: 'center',
                top: 0,
                textStyle: {
                    color: '#389dbb'
                }
            },
            color:["#2c59e6","#2409ee","#2c59e6","#00cae2"],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                show:false,
                type:"value",
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    }
                }
            },
            yAxis: {
                show:false,
                type: 'category',
                data: [],
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    },
                    formatter:''
                }
            },
            series: [{
                label:{
                    position: [0, -20],
                    show:true,
                    formatter: function(v){

                        return v.name+' : '+v.value
                    },
                    fontSize:12,
                    color:'#fff'
                },
                barCategoryGap:'30',
                type: 'bar',
                data:[],
                itemStyle: {
                    emphasis: {
                        barBorderRadius: 7
                    },
                    normal: {
                        barBorderRadius: 7
                    }
                }
            }]
        }
    }
}
