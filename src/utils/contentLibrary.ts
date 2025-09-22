const list = [
// {url:'/blogs',name:'Blog',type:'blog',library:'blog'},
{url:'/audio/blog',name:'Blog Audio',type:'blog',library:'audio'},
{url:'/audio/ebook',name:'Ebooks Audio',type:'ebook',library:'audio'},
{url:'/videos/ebook-playlist',name:'Ebooks',type:'ebook-playlist',library:'video'},
{url:'/videos/newsletter',name:'Newsletter',type:'newsletter',library:'video'},
{url:'/audio/newsletter',name:'Newsletter Audio',type:'newsletter',library:'audio'},
{url:'/videos/live',name:'Live unboxing',type:'live',library:'video'},
{url:'/videos/unboxingShorts',name:'Live Unboxing Shorts',type:'unboxingShorts',library:'video'},
{url:'/videos/videos',name:'Videos',type:'videos',library:'video'},
{url:'/videos/shorts',name:'Shorts',type:'shorts',library:'video'},
{url:'/audio/podcast',name:'Podcast',type:'podcast',library:'audio'},
{url:'/videos/podcast',name:'Podcast Videos',type:'podcast',library:'video'},
{url:'/videos/music',name:'Music Videos',type:'music',library:'video'},
{url:'/videos/meditations',name:'Meditations',type:'meditations',library:'video'},
{url:'/resources',name:'Guides',type:'guide',library:'guide'},

].map((itm:any)=>{
    itm.id=itm.name.toLowerCase().replaceAll(' ','_')
    return itm
}).sort((a, b) => a.name.localeCompare(b.name));

const name=(library:string,type:string)=>{
    const ext=list.find(itm=>itm.library==library&&itm.type==type)
    return ext?.name ||'--'
}

const contentLibrary = {
    list,
    name
};

export default contentLibrary;
