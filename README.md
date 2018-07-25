# dotfiles-win
dotfiles setup for zsh on Hyper for Windows 10. Basic Python, Node setup. Mostly a copy of https://github.com/jieverson/dotfiles-win, with a few minor improvements.

> Windows 10 can now officially run native Ubuntu subsystem. Its default settings comes with Bash, but it's possible to install different shells (my settings are using Zsh). If you need to learn how to install Ubuntu on Windows, take a look at this [Microsoft Guide](https://msdn.microsoft.com/en-us/commandline/wsl/install_guide).

### usage
Just run `install.sh` to install zsh (including oh-my-zsh and other important stuff) and symlink all dotfiles.

```
$ git clone https://github.com/luveenw/dotfiles-win.git ~/.dotfiles
$ cd ~/.dotfiles
$ sudo ./install.sh
```

To keep up to date, you can just `pull` this repo, and re-run `install.sh`.

### screenshots
<p align="center">
  <img src="screenshots/screenfetch.png" />
</p>
<p align="center">
  <img src="screenshots/fun.png" />
</p>
<p align="center">
  <img src="screenshots/midia.png" />
</p>
<p align="center">
  <img src="screenshots/working.png" />
</p>
<p align="center">
  <img src="screenshots/lol.gif" />
</p>

> **Windows Wallpaper for 4k resolution:** [./wallpaper.jpg](https://rawgit.com/jieverson/dotfiles-win/master/wallpaper.jpg)

### About My Terminal Emulator

As you can see at screenshots, I'm not using Windows default console emulator.
I'm using [Hyper](https://hyper.is). It's a customizable Terminal Emulator built in js. 
To use my settings, just copy [.hyper.js](https://rawgit.com/jieverson/dotfiles-win/master/.hyper.js) to your Windows home directory

```
cp ./.hyper.js ~/c/Users/{YOUR_USER}/
```

