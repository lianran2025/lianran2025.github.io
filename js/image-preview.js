document.addEventListener('DOMContentLoaded', function() {
  // 创建模态框
  const modal = document.createElement('div');
  modal.className = 'image-preview-modal';
  document.body.appendChild(modal);

  // 为所有文章中的图片添加点击事件
  const images = document.querySelectorAll('#post img');
  images.forEach(img => {
    // 保存原始尺寸
    img.dataset.originalWidth = img.naturalWidth;
    img.dataset.originalHeight = img.naturalHeight;

    img.addEventListener('click', function(e) {
      e.preventDefault();
      const modalImg = document.createElement('img');
      modalImg.src = this.src;
      modal.innerHTML = '';
      modal.appendChild(modalImg);
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
  });

  // 点击模态框关闭预览
  modal.addEventListener('click', function() {
    this.style.display = 'none';
    document.body.style.overflow = '';
  });

  // 添加键盘事件支持
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
}); 