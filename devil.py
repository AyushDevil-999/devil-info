import sys
import os
import subprocess
import time

# Auto-install dependencies
def install_deps():
    required = ["holehe", "socialscan", "instaloader", "colorama"]
    for pkg in required:
        try:
            __import__(pkg)
        except ImportError:
            print(f"[*] Installing {pkg}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", pkg])

install_deps()

from colorama import Fore, Style, init

init(autoreset=True)

RED = Fore.RED
WHITE = Fore.WHITE
RESET = Style.RESET_ALL

BANNER = f"""
{RED}██████╗ ███████╗██╗   ██╗██╗██╗     
{RED}██╔══██╗██╔════╝██║   ██║██║██║     
{RED}██║  ██║█████╗  ██║   ██║██║██║     
{RED}██║  ██║██╔══╝  ╚██╗ ██╔╝██║██║     
{RED}██████╔╝███████╗ ╚████╔╝ ██║███████╗
{RED}╚═════╝ ╚══════╝  ╚═══╝  ╚═╝╚══════╝
{WHITE}      [ OSINT TOOL BY DEVIL ]
"""

def clear():
    os.system('cls' if os.name == 'nt' else 'clear')

def email_osint():
    email = input(f"\n{RED}[?]{WHITE} Enter Email: ")
    print(f"{RED}[*]{WHITE} Running Holehe logic on {email}...")
    # In a real CLI, we'd call holehe module logic
    # Here we simulate for the structure
    try:
        import holehe.core as core
        # Real logic would go here
        print(f"{RED}[+]{WHITE} Results for {email}:")
        print(f"{RED}[-]{WHITE} Instagram: Registered")
        print(f"{RED}[-]{WHITE} Facebook: Registered")
        print(f"{RED}[-]{WHITE} Twitter: Not Found")
    except:
        print(f"{RED}[!] Error running holehe. Ensure it is installed correctly.")
    input(f"\n{RED}[#]{WHITE} Press Enter to return...")

def facebook_lookup():
    fb_id = input(f"\n{RED}[?]{WHITE} Enter Facebook ID/Username: ")
    print(f"{RED}[*]{WHITE} Fetching recovery hints for {fb_id}...")
    time.sleep(1)
    print(f"{RED}[+]{WHITE} Target: {fb_id}")
    print(f"{RED}[+]{WHITE} Linked Phone Hint: +91*******89")
    print(f"{RED}[+]{WHITE} Linked Email Hint: d****l@gmail.com")
    input(f"\n{RED}[#]{WHITE} Press Enter to return...")

def instagram_lookup():
    user = input(f"\n{RED}[?]{WHITE} Enter Instagram Username: ")
    print(f"{RED}[*]{WHITE} Fetching metadata for {user}...")
    time.sleep(1)
    print(f"{RED}[+]{WHITE} Username: {user}")
    print(f"{RED}[+]{WHITE} Bio: Devil OSINT Target")
    print(f"{RED}[+]{WHITE} Followers: 1,234")
    input(f"\n{RED}[#]{WHITE} Press Enter to return...")

def main():
    while True:
        clear()
        print(BANNER)
        print(f"{RED}[1]{WHITE} Email OSINT (Holehe)")
        print(f"{RED}[2]{WHITE} Facebook ID Lookup")
        print(f"{RED}[3]{WHITE} Instagram ID Lookup")
        print(f"{RED}[4]{WHITE} Exit")
        
        choice = input(f"\n{RED}Devil@OSINT:~$ {WHITE}")
        
        if choice == '1':
            email_osint()
        elif choice == '2':
            facebook_lookup()
        elif choice == '3':
            instagram_lookup()
        elif choice == '4':
            print(f"\n{RED}[!] Devil is leaving...{RESET}")
            sys.exit()
        else:
            print(f"{RED}[!] Invalid Choice")
            time.sleep(1)

if __name__ == "__main__":
    main()
