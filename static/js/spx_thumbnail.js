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

async function generateAllThumbnails() {
  const button = document.getElementById('generateAllBtn');
  const originalButtonText = button.innerHTML;
  button.disabled = true;

  const templateInputs = document.querySelectorAll('input[name="templateData[relpath]"]');
  const templatePaths = Array.from(templateInputs).map(input => input.value);
  const total = templatePaths.length;
  let generated = 0;
  let errors = 0;

  function updateButtonProgress() {
    button.innerHTML = `Generating... (${generated}/${total})`;
  }
  updateButtonProgress();

  for (const [index, path] of templatePaths.entries()) {
    try {
      const response = await axios.post('/thumbnail/thumbnail', { templatePath: path });
      const thumbnailUrl = response.data.thumbnailUrl;
      const thumbnailElement = document.getElementById('thumbnail_' + index);
      thumbnailElement.src = `/${thumbnailUrl}?t=${new Date().getTime()}`;
      generated++;
      updateButtonProgress();
    } catch (error) {
      console.error(`Error generating thumbnail for ${path}:`, error);
      errors++;
    }
  }

  if (errors > 0) {
    button.innerHTML = `Finished with ${errors} error(s)`;
    alert(`${errors} thumbnail(s) failed to generate. See console for details.`);
  } else {
    button.innerHTML = 'All Generated!';
  }

  setTimeout(() => {
    button.innerHTML = originalButtonText;
    button.disabled = false;
  }, 3000);
}