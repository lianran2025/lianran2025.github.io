function onLoad() {
    var path = getPath(window.location.href)
    console.log(path)
    var menuItems = Array.from(document.querySelectorAll('a.menu-item')).filter(v => isDomEntity(v))
    console.log(menuItems)
    for (key in menuItems) {
        item = menuItems[key]
        p = getPath(item.href)
        console.log(p)
        if(p == path) {
            item.style.textDecoration = "none"
        } else {
            item.style.textDecoration = "underline" 
        }
    }
    
    // 初始化视频缩略图
    initVideoThumbnails()
}

// 初始化视频缩略图显示
function initVideoThumbnails() {
    const videoThumbnails = document.querySelectorAll('.video-thumbnail')
    
    videoThumbnails.forEach(function(video) {
        // 如果 video 是隐藏的（等待图片加载），先不处理
        // 只有当图片加载失败时，才会显示 video
        const isHidden = video.style.display === 'none' || window.getComputedStyle(video).display === 'none'
        
        if (isHidden) {
            // 监听图片加载失败事件，如果图片失败，显示 video
            const img = video.previousElementSibling
            if (img && img.classList.contains('video-thumbnail-img')) {
                img.addEventListener('error', function() {
                    video.style.display = 'block'
                    initVideoThumbnail(video)
                }, { once: true })
            }
        } else {
            // 如果 video 已经显示，直接初始化
            initVideoThumbnail(video)
        }
    })
}

// 初始化单个视频缩略图
function initVideoThumbnail(video) {
    // 设置视频属性，确保能够显示第一帧
    video.setAttribute('preload', 'auto')  // 改为 auto 以加载更多数据
    video.muted = true
    video.playsInline = true
    
    // 当视频可以播放时，跳转到第一帧
    video.addEventListener('canplay', function() {
        // 跳转到 0.1 秒位置（确保有画面）
        this.currentTime = 0.1
    }, { once: true })
    
    // 当跳转完成后，暂停视频（显示第一帧）
    video.addEventListener('seeked', function() {
        this.pause()
        // 确保视频显示
        this.style.display = 'block'
    }, { once: true })
    
    // 如果元数据加载完成，也尝试显示第一帧
    video.addEventListener('loadedmetadata', function() {
        // 尝试跳转到第一帧
        try {
            if (this.readyState >= 1) {  // HAVE_METADATA
                this.currentTime = 0.1
            }
        } catch (e) {
            // 如果失败，尝试加载更多数据
            this.load()
        }
    })
    
    // 处理加载错误
    video.addEventListener('error', function(e) {
        console.warn('Video thumbnail load error:', e)
        // 如果加载失败，尝试使用 canvas 提取第一帧
        extractVideoFrame(this)
    })
    
    // 开始加载视频
    video.load()
    
    // 如果 2 秒后还没有显示，尝试强制加载
    setTimeout(function() {
        if (video.readyState < 2) {  // HAVE_CURRENT_DATA
            video.currentTime = 0.1
            video.load()
        }
    }, 2000)
}

// 使用 canvas 提取视频第一帧作为缩略图
function extractVideoFrame(video) {
    const videoSrc = video.getAttribute('data-video-src') || 
                     (video.querySelector('source') && video.querySelector('source').src)
    
    if (!videoSrc) return
    
    const tempVideo = document.createElement('video')
    tempVideo.crossOrigin = 'anonymous'
    tempVideo.muted = true
    tempVideo.playsInline = true
    
    tempVideo.addEventListener('loadedmetadata', function() {
        tempVideo.currentTime = 0.1
    })
    
    tempVideo.addEventListener('seeked', function() {
        try {
            const canvas = document.createElement('canvas')
            canvas.width = tempVideo.videoWidth || 120
            canvas.height = tempVideo.videoHeight || 120
            const ctx = canvas.getContext('2d')
            ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height)
            
            // 将 canvas 转换为图片并替换 video 标签
            const img = document.createElement('img')
            img.src = canvas.toDataURL('image/jpeg', 0.8)
            img.style.width = '100%'
            img.style.height = '100%'
            img.style.objectFit = 'cover'
            
            video.parentNode.replaceChild(img, video)
        } catch (e) {
            console.error('Failed to extract video frame:', e)
        }
    })
    
    tempVideo.src = videoSrc
    tempVideo.load()
}

function isDomEntity(entity) {
    if (typeof entity === 'object' && entity.nodeType !== undefined) {
        return true;
    }
    else {
        return false;
    }
}

function getPath(url) {
    p = url.replace(window.location.origin, '')
    if(p[p.length - 1] !== '/') {
        p += '/'
    }
    return p
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onLoad)
} else {
    onLoad()
}
