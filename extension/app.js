const logLabel = 'matoruru/chrome-extension_better-experience-argocd: '

const appLog = (...args) => console.log(`${logLabel} `, ...args)

const intervalTime = 100

const hasText = (elem, s) => elem.textContent.includes(s)

const pickElement = (elems, s) => elems.filter(elem => hasText(elem, s))[0]

const checkTitle = () => {
  return new Promise((resolve, reject) => {
    const timerId = setInterval(() => {
      const expectedTitle = 'Applications Tiles - Argo CD'
      const title = document.querySelector('title')

      if (!title) return

      if (hasText(title, expectedTitle)) {
        clearInterval(timerId)
        resolve(title.textContent)
      } else {
        reject(`Title is not correct (Expected ${expectedTitle} but "${title.textContent}"). This migit be another page!`)
      }
    }, intervalTime)
  })
}

const getNewAppSiblingPanel = () => {
  return new Promise((resolve) => {
    const timerId = setInterval(() => {
      const newAppSlidingPanel = document.querySelector('div.sliding-panel__wrapper:has(button[qe-id=applications-list-button-create])')
      if (!newAppSlidingPanel) return
      const isSlidingPanelOpened = newAppSlidingPanel.parentElement.classList.contains('sliding-panel--opened')
      clearInterval(timerId)
      resolve({ newAppSlidingPanel, isSlidingPanelOpened })
    }, intervalTime)
  })
}

const setInputListenerToInputFields = () => {
  return new Promise((resolve) => {
    const timerId = setInterval(() => {
      const projectNameField = document.querySelector('input[qe-id="application-create-field-project"]')
      const repositoryURLField = document.querySelector('input[qe-id="application-create-field-repository-url"]')
      const clusterURLField = document.querySelector('input[qe-id="application-create-field-cluster-url"]')
      // This is not needed. ClusterURLField works fine with both somehow...
      //const clusterNameField = document.querySelector('input[qe-id="application-create-field-cluster-name"]')

      appLog('Detecting input fields ...')
      // Make sure every fields exist.
      if (!(projectNameField && repositoryURLField && clusterURLField)) return
      appLog('Input fields detected!')

      const filterAutoCompleteList = (event, inputField) => {
        if (!inputField.nextSibling) return
        const autoComplateList = Array.from(inputField.nextSibling.children)
        const value = event.target.value
        const matchedList = autoComplateList.filter((ac => ac.innerText.includes(value)))
        const unMatchedList = autoComplateList.filter((ac => !ac.innerText.includes(value)))
        matchedList.forEach(elem => elem.style.display = '')
        unMatchedList.forEach(elem => elem.style.display = 'none')
      }

      // To avoid set the listner more than once.
      const listenerAttribute = 'chrome-extension_better-experience-argocd-listener-is-set';

      [
        projectNameField,
        repositoryURLField,
        clusterURLField
      ].forEach(inputField => {
        if (inputField.getAttribute(listenerAttribute)) {
          appLog('Input listener is already set! skipped.')
        } else {
          inputField.addEventListener('input', (e) => {
            filterAutoCompleteList(e, inputField)
          })
          inputField.setAttribute(listenerAttribute, true)
          appLog('Input listener has been set!')
        }
      })

      if (projectNameField) {
        clearInterval(timerId)
        resolve({})
      }
    }, intervalTime)
  })
}

const app = async () => {
  const title = await checkTitle()
  appLog('Argo CD page detected!')
  appLog(`Title detected: "${title}".`)

  // The panel that appears by clicking NEW APP button.
  const { newAppSlidingPanel, isSlidingPanelOpened } = await getNewAppSiblingPanel()
  appLog('Sliding Panel detedted!')

  // For when the panel is initially opened
  // (i.e. reload the page affter opened the panel).
  if (isSlidingPanelOpened) {
    await setInputListenerToInputFields()
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        if (mutation.target.classList.contains('sliding-panel__wrapper')) {
          getNewAppSiblingPanel().then(({ isSlidingPanelOpened }) => {
            if (isSlidingPanelOpened) {
              appLog("Panel opened.")
              setInputListenerToInputFields()
            } else {
              appLog('Panel closed.')
            }
          })
        }
      }
    })
  })

  // TODO: Once the target node is re-created by moving to another page,
  //       this observer doesn't work anymore.
  observer.observe(newAppSlidingPanel, { childList: true, subtree: true })
}

const main = (e) => {
  appLog('Launched!')
  app().catch(e => {
    appLog('Something went wrong! Reason: ', e)
  })
};

window.addEventListener("load", main, false);
