import { assets } from "../assets/assets"

const Footer = () => {
  return (
    <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
     <div>
        <img src={assets.logo} className="mb-5 w-32" alt="" />
        <p className="w-full md:-2/3 text-gray-600">
        The footer should provide a satisfying 
        user experience by presenting useful information
         that will, at the same time, 
        increase the performance of the ecommerce website
        </p>
     </div>
     <div >
      <p className="text-xl font-mediummb-5">COMPANY</p>
      <ul className="flex flex-col gap-1 text-gray-600">
      <li>Home</li>
      <li>About us</li>
      <li>Derivery</li>
      <li>Privacy policy</li>
      </ul>
     </div>
     <div>
        <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
        <ul className="flex flex-col gap-1 text-gray-600">
          <li>+250 795-984-030</li>
          <li>shoppingrw1a@gmail.com</li>
        </ul>
     </div>
     <div>
        <hr />
        <p className="py-5 text-sm text-center">Copyright 2024@ shoppingrw1a.com - All Right Reserved</p>
     </div>
    </div>
  )
}

export default Footer