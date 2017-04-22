/**
 * Created by LiYonglei on 2017/4/22.
 * 将传入的dom以及其后代元素的外部css转化为内联css
 * 注意:该方法并不支持伪元素的转化,因此转化完毕后，若外部css一旦不起作用了，那么伪元素都将会丢失
/**/
function toInnerStyle(dom){
    getElements(dom).forEach(function(dom){
        transformCSS(dom);
    })
    function transformCSS(dom){
        var computedStyle=window.getComputedStyle(dom);
        dom.setAttribute("style",getStyle(computedStyle).join(";"));
    }
    function getStyle(computedStyle){
        var csses={},
            csses2={};
        for(var key in computedStyle){
            if(!/-/.test(key)&&isNaN(key)&& typeof computedStyle[key]==="string"&&computedStyle[key].length){
                csses[key]=computedStyle[key];
            }
        }
        Object.keys(csses).forEach(function(key){
            var key2=key.replace(/^ms|^webkit|^moz|[A-Z]/g,function(prefix){
                return "-"+prefix.toLowerCase();
            });
            csses2[key2]=csses[key];
        });
        return Object.keys(csses2).map(function(key){
            return key+":"+csses2[key];
        });
    }
    function getElements(dom){
        var elements=[];
        function getNodes(dom){
            elements.push(dom);
            Array.prototype.forEach.call(dom.children,function(dom){
                getNodes(dom);
            })
        }
        getNodes(dom);
        return elements;
    }
}