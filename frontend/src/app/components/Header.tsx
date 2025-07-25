"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { AvatarFallback } from "@radix-ui/react-avatar";
import {
  BookLock,
  ChevronRight,
  FileTerminal,
  Heart,
  HelpCircle,
  Lock,
  LogOut,
  Menu,
  Package,
  PiggyBank,
  Search,
  ShoppingCart,
  User,
  User2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { logout, toggledLoginDialog } from "@/store/slice/userSlice";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import AuthPage from "./AuthPage";
import { useGetCartQuery, useLogoutMutation } from "@/store/api";
import toast, { Toaster } from "react-hot-toast";
import { setCart } from "@/store/slice/cartSlice";

function Header() {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoginOpen = useSelector(
    (state: RootState) => state.user.isLoginDialogOpen
  );
  const user = useSelector((state: RootState) => state.user.user);
  const [logoutMutation] = useLogoutMutation();
  // console.log("user", user);
  const userPlaceholder = user?.name
    ?.split(" ")
    .map((name: string) => name[0])
    .join(""); // Placeholder for user image
  const cartItemCount = useSelector(
    (state: RootState) => state.cart.items.length
  );
  const { data: cartData } = useGetCartQuery(user?._id, { skip: !user });
  const [searchTerms, setSearchTerms] = useState("");

  const handleSearch = () => {
    router.push(`/books?search=${encodeURIComponent(searchTerms)}`);
  };

  const handleProtectionNAvigation = (href: string) => {
    if (user) {
      router.push(href);
      setIsDropDownOpen(false);
    } else {
      dispatch(toggledLoginDialog());
      setIsDropDownOpen(false);
    }
  };

  useEffect(() => {
    if (cartData?.success && cartData?.data) {
      dispatch(setCart(cartData.data));
    }
  }, [cartData, dispatch]);

  const handleLoginClick = () => {
    dispatch(toggledLoginDialog());
    setIsDropDownOpen(false);
  };
  const handleLogOut = async () => {
    try {
      await logoutMutation({}).unwrap();
      dispatch(logout());
      toast.success("user logged out successfully");
      setIsDropDownOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out");
    }
  };

  const menuItem = [
    // ✅ Show user profile block if logged in
    ...(user
      ? [
          {
            href: "account/profile",
            content: (
              <div className="flex items-center p-2 border-b space-x-4">
                <Avatar className="w-12 h-12 -ml-12 rounded-full">
                  {user?.profilePicture ? (
                    <AvatarImage src={user?.profilePicture} alt="user_image" />
                  ) : (
                    <AvatarFallback>{userPlaceholder}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-md font-semibold">{user?.name}</span>
                  <span className="text-xs text-gray-500">{user?.email}</span>
                </div>
              </div>
            ),
          },
        ]
      : [
          {
            icon: <Lock className="h-5 w-5" />,
            lable: "Login/Sign UP",
            onclick: handleLoginClick,
          },
        ]),

    // ✅ User-specific items (excluding logout)
    ...(user
      ? [
          {
            icon: <User className="h-5 w-5 cursor-pointer" />,
            lable: "MyProfile",
            onclick: () => handleProtectionNAvigation("/account/profile"),
          },
          {
            icon: <Package className="h-5 w-5 cursor-pointer" />,
            lable: "My Order",
            onclick: () => handleProtectionNAvigation("/account/orders"),
          },
          {
            icon: <PiggyBank className="h-5 w-5 cursor-pointer" />,
            lable: "My Selling Orders",
            onclick: () =>
              handleProtectionNAvigation("/account/selling-products"),
          },
          {
            icon: <ShoppingCart className="h-5 w-5 cursor-pointer" />,
            lable: "Shopping Cart",
            onclick: () => handleProtectionNAvigation("/checkout/cart"),
          },
          {
            icon: <Heart className="h-5 w-5 cursor-pointer" />,
            lable: "My Wishlist",
            onclick: () => handleProtectionNAvigation("/account/wishlist"),
          },
        ]
      : []),

    // ✅ Static links (always visible)
    {
      icon: <User2 className="h-5 w-5" />,
      lable: "About Us",
      href: "/about-us",
    },
    {
      icon: <FileTerminal className="h-5 w-5" />,
      lable: "Terms & Conditions",
      href: "/terms-and-conditions",
    },
    {
      icon: <BookLock className="h-5 w-5" />,
      lable: "Privacy Policy",
      href: "/privacy-policy",
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      lable: "Help",
      href: "/how-it-works",
    },

    // ✅ Logout item LAST (only if logged in)
    ...(user
      ? [
          {
            icon: <LogOut className="h-5 w-5 cursor-pointer" />,
            lable: "Logout",
            onclick: handleLogOut,
          },
        ]
      : []),
  ];

  // const menuItem = [
  //   ...(user && user
  //     ? [
  //         {
  //           href: "account/profile",
  //           content: (
  //             <div className="flex items-center p-2 border-b space-x-4">
  //               <Avatar className="w-12 h-12 -ml-12 rounded-full">
  //                 {user?.profilePicture ? (
  //                   <AvatarImage alt="user_image"></AvatarImage>
  //                 ) : (
  //                   <AvatarFallback>{userPlaceholder}</AvatarFallback>
  //                 )}
  //               </Avatar>
  //               <div className="flex flex-col">
  //                 <span className="text-md font-semibold">{user?.name}</span>
  //                 <span className="text-xs text-gray-500">{user?.email}</span>
  //               </div>
  //             </div>
  //           ),
  //         },
  //       ]
  //     : [
  //         {
  //           icon: <Lock className="h-5 w-5" />,
  //           lable: "Login/Sign UP",
  //           onclick: handleLoginClick,
  //         },
  //       ]),
  //       {
  //         icon: <Lock className="h-5 w-5" />,
  //         lable: "Login/Sign UP",
  //         onclick: handleLoginClick,
  //       },
  //   {
  //     icon: <User className="h-5 w-5" />,
  //     lable: "MyProfile",
  //     onclick: () => handleProtectionNAvigation("/account/profile"),
  //   },
  //   {
  //     icon: <Package className="h-5 w-5" />,
  //     lable: "My Order",
  //     onclick: () => handleProtectionNAvigation("/account/orders"),
  //   },
  //   {
  //     icon: <PiggyBank className="h-5 w-5" />,
  //     lable: "My Selling Orders",
  //     onclick: () => handleProtectionNAvigation("/account/selling-products"),
  //   },
  //   {
  //     icon: <ShoppingCart className="h-5 w-5" />,
  //     lable: "Shopping Cart",
  //     onclick: () => handleProtectionNAvigation("/account/cart"),
  //   },
  //   {
  //     icon: <Heart className="h-5 w-5" />,
  //     lable: "My Wishlist",
  //     onclick: () => handleProtectionNAvigation("/account/wishlist"),
  //   },
  //   {
  //     icon: <User2 className="h-5 w-5" />,
  //     lable: "About Us",
  //     href: "/about-us",
  //   },
  //   {
  //     icon: <FileTerminal className="h-5 w-5" />,
  //     lable: "Terms & Conditions",
  //     href: "/terms-and-conditions",
  //   },
  //   {
  //     icon: <BookLock className="h-5 w-5" />,
  //     lable: "Privacy Policy",
  //     href: "/privacy-policy",
  //   },
  //   {
  //     icon: <HelpCircle className="h-5 w-5" />,
  //     lable: "Help",
  //     href: "/how-it-works",
  //   },
  //   ...(user && user ? [
  //     {
  //       icon: <LogOut className="h-5 w-5" />,
  //       lable: "Logout",
  //       onclick: handleLogOut,
  //     },
  //   ] :[]),
  // ];

  const MenuItems = ({ className = "" }) => (
    <div className={className}>
      {menuItem?.map((item, index) =>
        item?.href ? (
          <Link
            key={index}
            href={item?.href}
            className="flex items-center text-sm py-3 gap-3 px-4 rounded-lg hover:bg-gray-200"
            onClick={() => setIsDropDownOpen(false)}
          >
            {item?.icon}
            <span>{item?.lable}</span>
            {item?.content && <div className="mmt-1">{item.content}</div>}
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Link>
        ) : (
          <button
            key={index}
            className="flex w-full items-center text-sm py-3 gap-3 px-4 rounded-lg hover:bg-gray-200"
            onClick={item?.onclick}
          >
            {item?.icon}
            <span>{item?.lable}</span>
            <ChevronRight className="h-4 w-4 ml-auto" />
          </button>
        )
      )}
    </div>
  );
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      {/*Desktop header*/}
      <div className="container w-[80%] hidden lg:flex justify-between items-center p-4 mx-auto">
        <Link href="/" className="felx items-center">
          <Image
            src="/images/web-logo.png"
            width={450}
            height={100}
            alt="desktop_logo"
            className="h-15 w-auto"
          />
        </Link>
        <div className="flex flex-1 items-center justify-center max-w-xl px-4">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Book Name / Author / Subject / Publisher"
              className="w-full pr-10"
              value={searchTerms}
              onChange={(e) => setSearchTerms(e.target.value)}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-1/2 -translate-y-1/2"
              onClick={handleSearch}
            >
              <Search className="h-5 w-5 cursor-pointer" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/book-sell">
            <Button
              variant="secondary"
              className="bg-yellow-400 text-gray-950 hover:bg-yellow-600"
            >
              Sell Used Books
            </Button>
          </Link>

          <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <Avatar className="h-8 w-8 rounded-full">
                  {user?.profilePicture ? (
                    <AvatarImage
                      src={user?.profilePicture}
                      alt="user_image"
                      className="flex items-center justify-between"
                    ></AvatarImage>
                  ) : userPlaceholder ? (
                    <AvatarFallback>{userPlaceholder}</AvatarFallback>
                  ) : (
                    <User className="ml-2 mt-2" />
                  )}
                </Avatar>
                My Account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-2">
              <MenuItems />
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/checkout/cart">
            <div className="relative">
              <Button variant="ghost" className="relative">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart
              </Button>
              {user && cartItemCount > 0 && (
                <span className="absolute top-2 left-5 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full px-1 text-xs">
                  {cartItemCount}
                </span>
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* mobile header */}
      <div className="container mx-auto lg:hidden flex justify-between items-center p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader>
              <SheetTitle className="sr-only"></SheetTitle>
            </SheetHeader>
            <div className="border-b p-4 ">
              <Link href="/">
                <Image
                  src="/images/web-logo.png"
                  width={150}
                  height={40}
                  alt="mobile_logo"
                  className="h-10 w-auto"
                />
              </Link>
            </div>
            <MenuItems className="py-2" />
          </SheetContent>
        </Sheet>

        <Link href="/" className="felx items-center">
          <Image
            src="/images/web-logo.png"
            width={450}
            height={100}
            alt="desktop_logo"
            className="h-6 md:h-10 w-20"
          />
        </Link>
        <div className="flex flex-1 items-center justify-center max-w-xl px-4">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search Box...."
              className="w-full pr-10"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-1/2 -translate-y-1/2"
            >
              <Search className="h-5 w-5 cursor-pointer" />
            </Button>
          </div>
        </div>
        <Link href="/checkout/cart">
          <div className="relative">
            <Button variant="ghost" className="relative">
              <ShoppingCart className="h-5 w-5 mr-2" />
            </Button>
            {user && cartItemCount > 0 && (
              <span className="absolute top-2 left-5 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full px-1 text-xs">
                {cartItemCount}
              </span>
            )}
          </div>
        </Link>
      </div>
      <AuthPage isLoginOpen={isLoginOpen} setIsLoginOpen={handleLoginClick} />
      {/* <Toaster position="top-right" /> */}
    </header>
  );
}

export default Header;
