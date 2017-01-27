require('./object-keys-polyfill');

module.exports = class Preloader{
    constructor(){
        this._debugMode = false;
        this._timeout = 15000;
        this._loadedItemId={};
    }

    loadImgList(list,cb){
        let listLength = list.length;

        let callback = function(url){
            let loadedItemLength = Object.keys(this._loadedItemId).length;

            if(this._debugMode){
                console.log(`${loadedItemLength}/${listLength} Preloader loaded img:\n${url}`);
            }
            
            if(loadedItemLength === list.length){
                cb(list);
            }
        };

        for(let i =0;i<list.length;i++){
            this._loadImg(i,list[i],callback);    
        }
    }

    _setProp(prop,val){
        if(this[prop] !== undefined){
            this[prop] = val;
        }
    }

    _getProp(prop){
        return (this[prop] !== undefined) ?  this[prop] : '';
    }

    _loadImg(index,imgUrl,cb){
        let _this = this,
            img = new Image(),
            timeoutId = null;

        let markItemLoaded = function(){
            let _list = _this._getProp('_loadedItemId');

            _list[index] = true;
            _this._setProp('_loadedItemId',_list);

            if(cb !==undefined){
                cb.call(_this,imgUrl);
            }
        };
        
        img.onload = function(){
            markItemLoaded();
            clearTimeout(timeoutId);
        };

        timeoutId = setTimeout(markItemLoaded,this._timeout);
        img.src = imgUrl;
    }
}