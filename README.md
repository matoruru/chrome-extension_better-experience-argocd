# Better Experience for Argo CD

Adds a realtime-filter feature for input fields such as Project Name, Repository URL and Cluster URL.

### Problem

Argo CD's UI doesn't filter those values in an auto-complete list based on your input. So, as the number of values increases it causes a looooong scroll for you to reach the value that you need.

### Why you need this

This extension solves the problem above by providing a realtime-filter feature which updates the auto-complete list as you input.

# Installation

[Better Experience for Argo CD - Chrome Web Store](https://chrome.google.com/webstore/detail/better-experience-for-arg/khpjdlmlaoikdkkjfkeelkcpgmabmcpb?hl=en&authuser=0)

# Development

1. Clone this repo.

   ```
   gh repo clone matoruru/chrome-extension_better-experience-argocd
   ```

1. **Enable** developer mode from `chrome://extensions/`.

1. Click *Load unpacked*.

1. Select `extension` folder.

1. **Disable** developer mode from `chrome://extensions/`.

1. Enjoy your life with better Argo CD experience 🎉
