function generateThumbnail(templatePath, index) {
  const button = event.target;
  const originalButtonText = button.innerHTML;
  button.innerHTML = 'Generating...';
  button.disabled = true;

  axios.post('/thumbnail/thumbnail', { templatePath: templatePath })
    .then(function (response) {
      const thumbnailUrl = response.data.thumbnailUrl;
      const thumbnailElement = document.getElementById('thumbnail_' + index);
      thumbnailElement.src = `/${thumbnailUrl}?t=${new Date().getTime()}`;
      button.innerHTML = 'Generated!';
      setTimeout(() => {
        button.innerHTML = originalButtonText;
        button.disabled = false;
      }, 2000);
    })
    .catch(function (error) {
      console.error('Error generating thumbnail:', error);
      alert('Error generating thumbnail. See console for details.');
      button.innerHTML = 'Error!';
      setTimeout(() => {
        button.innerHTML = originalButtonText;
        button.disabled = false;
      }, 2000);
    });
}