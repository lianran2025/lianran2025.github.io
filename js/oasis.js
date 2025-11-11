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
    
    // 初始化文章筛选功能
    initPostFilters()
}

function initPostFilters() {
    const dateFilter = document.getElementById('date-filter')
    const tagFilters = document.querySelectorAll('.filter-tag')
    const clearBtn = document.getElementById('clear-filters')
    const postItems = document.querySelectorAll('#recent-posts .post-item')
    
    if (!dateFilter || !tagFilters.length || !postItems.length) {
        return // 不在首页，不执行筛选功能
    }
    
    let selectedDate = ''
    let selectedTag = 'all'
    
    // 日期筛选
    dateFilter.addEventListener('change', function(e) {
        selectedDate = e.target.value
        filterPosts(selectedDate, selectedTag)
    })
    
    // 标签筛选
    tagFilters.forEach(btn => {
        btn.addEventListener('click', function() {
            // 更新按钮状态
            tagFilters.forEach(b => b.classList.remove('active'))
            this.classList.add('active')
            
            selectedTag = this.getAttribute('data-tag')
            filterPosts(selectedDate, selectedTag)
        })
    })
    
    // 清除筛选
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            selectedDate = ''
            selectedTag = 'all'
            dateFilter.value = ''
            tagFilters.forEach(b => {
                b.classList.remove('active')
                if (b.getAttribute('data-tag') === 'all') {
                    b.classList.add('active')
                }
            })
            filterPosts('', 'all')
        })
    }
    
    function filterPosts(date, tag) {
        postItems.forEach(item => {
            const itemDate = item.getAttribute('data-date') || ''
            const itemTags = (item.getAttribute('data-tags') || '').split(',')
            
            let show = true
            
            // 日期筛选
            if (date && itemDate !== date) {
                show = false
            }
            
            // 标签筛选
            if (tag !== 'all' && !itemTags.includes(tag)) {
                show = false
            }
            
            // 显示/隐藏文章
            if (show) {
                item.style.display = 'block'
                setTimeout(() => {
                    item.style.opacity = '1'
                    item.style.transform = 'translateY(0)'
                }, 10)
            } else {
                item.style.opacity = '0'
                item.style.transform = 'translateY(-10px)'
                setTimeout(() => {
                    item.style.display = 'none'
                }, 300)
            }
        })
    }
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
