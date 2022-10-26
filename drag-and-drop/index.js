//https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop

const init = () => {
  const myForm = document.querySelector('#upload-form');
  const fileManagerElement = document.querySelector('#file-manager');

  const bytesToSize = function(bytes) {
    return Math.round(bytes * 100 / (1024 * 1024)) /100 + ' MB';
  };
  const fileManager = {
    data: [],
    add: function(files) {
      for (var i = 0; i < files.length; i++) {
        let fileExists = false;
        const fileName = files[i].name;

        for (var j = 0; j < this.data.length; j++) {
          const file = this.data[j];
          if (file.name === fileName) {
            fileExists = true;
            this.data[j] = files[i];
            break;
          }
        }

        if (!fileExists) {
          this.data.push(files[i]);
        }
      }  
      console.log(this.data);
      this.updateMarkup();
    },
    remove: function(fileName) {
      for (var i = 0; i < this.data.length; i++) {
        const file = this.data[i];
        if (file.name === fileName) {
          this.data.splice(i, 1); 
        }
      }
      console.log(this.data);
    },
    updateMarkup: function() {
      fileManagerElement.innerHTML = '';
      for (var i = 0; i < this.data.length; i++) {
        const file = this.data[i];
        const entry = document.createElement('li');
        const fileData = `<span class="name">${file.name}</span>
          <span class="size">${bytesToSize(file.size)}</span>
          <span class="action"><button>Delete</button></span>`;
        entry.innerHTML = fileData;
        fileManagerElement.appendChild(entry);
      }  
    }
  };
  const dropZone = document.querySelector('#drop_zone');
  const hiddenFileInput = dropZone.querySelector('#myfiles');
  const browseButton = dropZone.querySelector('#browse');
  const dropHandler = (event) => {
    event.preventDefault();
    event.target.classList.remove('dragging');
    fileManager.add(event.dataTransfer.files);
  };
  const dragOverHandler = (event) => {
    event.preventDefault();
  };
  const dragEnterHandler = (event) => {
    event.preventDefault();
    event.target.classList.add('dragging');
  };
  const dragLeaveHandler = (event) => {
    event.preventDefault();
    event.target.classList.remove('dragging');
  };
  const submitHandler = (myForm) => {
    const formData = new FormData(myForm);

    // remove files that are uploaded in the form
    for (var key of formData.entries()) {
      if (key[0] === 'myfiles[]') {
        formData.delete('myfiles[]');
      }
    }

    // add files stored in fileManager to formData
    if (fileManager.data && fileManager.data.length) {
      for (var i=0; i<fileManager.data.length; i++) {
        const file = fileManager.data[i];
        formData.append('myfiles[]', file);
      }
    } else {
      alert('No file is selected');
      return;
    }

    fetch(myForm.getAttribute('action'), {
        method: myForm.getAttribute('method'),
        body: formData
    })
    .then(() => { 
      alert(fileManager.data.length + ' files were uploaded!');
      fileManager.data = [];
      fileManagerElement.innerHTML = '';
    })
    .catch(() => { console.log('Error'); });
  };

  dropZone.addEventListener('drop', dropHandler);
  dropZone.addEventListener('dragover', dragOverHandler);
  dropZone.addEventListener('dragenter', dragEnterHandler);
  dropZone.addEventListener('dragleave', dragLeaveHandler);
  dropZone.addEventListener('dragend', dragLeaveHandler);
  browseButton.addEventListener('click', event => {
    event.preventDefault();
    hiddenFileInput.click();
  });
  hiddenFileInput.addEventListener('change', (event) => {
    fileManager.add(event.target.files);
  });

  myForm.addEventListener('submit', event => {
    event.preventDefault();
    submitHandler(myForm);
  });
  fileManagerElement.addEventListener('click', (event) => {
    if (event.target.nodeName === 'BUTTON') {
      const item = event.target.closest('li');
      const fileName = item.querySelector('span.name').textContent;
      item.remove();
      fileManager.remove(fileName);
    }
  });
};

document.addEventListener('DOMContentLoaded', (event) => {
  init();
});