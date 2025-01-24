// Page shown when the user tries to access a page that doesn't exist
export default function NotFound() {
  return (
    <div className="bgdiv relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1619.9 248"
        className=" hidden lg:block fixed bottom-0 w-3/4 "
      >
        <g>
          <path
            d="M1619.9,248H0c74.7-49.8,149.5-98.9,224.6-145.8C296.8,57,372.3-2.9,446.9,0.1C504.1,2.4,557.1,42.8,609.4,77
		c42.4,27.8,84.5,56.1,127.9,82.3c29.7,17.9,57.9,36.5,92.3,44.1c26.5,5.9,54.3,7.8,81.3,9.4c35.8,2.2,72.4,0.4,107.2-8.5
		c35.2-9,67.9-25.4,100.9-40.2c25.5-11.4,52.2-20.8,78.6-30c52.7-18.3,107.5-33.6,163.6-35.7c77.9-2.9,150.3,47.5,215.6,109.2
		C1591,220.9,1605.4,234.3,1619.9,248z"
            fill="#121212"
          />
        </g>
      </svg>
      <a href="/">
        <img
          src="/logotext.svg"
          alt="logo"
          className="w-60 absolute left-10 top-10 hidden lg:block"
        />
      </a>
      <svg
        width="724"
        height="588"
        viewBox="0 0 724 588"
        xmlns="http://www.w3.org/2000/svg"
        className="hidden lg:block absolute top-0 right-0"
      >
        <g>
          <path
            d="M23,0C20,0,12.5,25.8,11.8,28.2C4.5,50.7,0.2,74.3,0,98c-0.9,95.4,73.4,161.1,157.6,190.7
	c31.6,11.1,65.9,17.5,97.5,30c28.1,11.1,53.6,27.8,77.1,46.6c23.3,18.7,46.9,37.5,68.6,58c22.3,21.1,37.6,48.5,59.9,69.6
	c26.6,25.3,59.6,38.6,93.7,50.6c37.6,13.2,75.9,24.5,114.7,33.4c3.1,0.7,55,10.2,55,11.1c0,0,0-588,0-588S23.4,0,23,0z"
            fill="#121212"
          />
        </g>
      </svg>
      <div className="relative lg:hidden block">
        <svg
          width="724"
          height="588"
          viewBox="0 0 724 588"
          xmlns="http://www.w3.org/2000/svg"
          className="w-screen h-full"
        >
          <g>
            <path
              d="M23,0C20,0,12.5,25.8,11.8,28.2C4.5,50.7,0.2,74.3,0,98c-0.9,95.4,73.4,161.1,157.6,190.7
	c31.6,11.1,65.9,17.5,97.5,30c28.1,11.1,53.6,27.8,77.1,46.6c23.3,18.7,46.9,37.5,68.6,58c22.3,21.1,37.6,48.5,59.9,69.6
	c26.6,25.3,59.6,38.6,93.7,50.6c37.6,13.2,75.9,24.5,114.7,33.4c3.1,0.7,55,10.2,55,11.1c0,0,0-588,0-588S23.4,0,23,0z"
              fill="#121212"
            />
          </g>
        </svg>
        <div className="absolute pt-24 inset-0 flex flex-col items-center justify-center">
          <img src="/notFound.svg" alt="404" className="w-3/5  teeter" />
        </div>
      </div>
      <svg
        width="319"
        height="11"
        viewBox="0 0 319 11"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-10 right-48 hidden lg:block"
      >
        <g>
          <g>
            <path
              d="M89.5,11h-84C2.5,11,0,8.5,0,5.5v0C0,2.5,2.5,0,5.5,0h84c3,0,5.5,2.5,5.5,5.5v0C95,8.5,92.5,11,89.5,11z"
              fill="#0d0d0d"
            />
            <path
              d="M201.5,11h-66c-3,0-5.5-2.5-5.5-5.5v0c0-3,2.5-5.5,5.5-5.5h66c3,0,5.5,2.5,5.5,5.5v0C207,8.5,204.5,11,201.5,11z"
              fill="#0d0d0d"
            />
            <path
              d="M313.5,11h-66c-3,0-5.5-2.5-5.5-5.5v0c0-3,2.5-5.5,5.5-5.5h66c3,0,5.5,2.5,5.5,5.5v0C319,8.5,316.5,11,313.5,11z"
              fill="#0d0d0d"
            />
          </g>
        </g>
      </svg>
      <div className="absolute top-10 left-0 w-full flex justify-center">
        <a href="/">
          <img
            src="/logotext.svg"
            alt="logo"
            className="w-48 lg:hidden block"
          />
        </a>
      </div>
      <img
        src="/notFound.svg"
        alt="404"
        className="hidden lg:block absolute w-2/5 top-40 right-44 teeter"
      />
      <div className="flex flex-col items-center justify-center mt-8 lg:hidden ">
        <a className="animated-button" href="/" rel="noopener noreferrer">
          <p>Home</p>
          <span></span>
        </a>
        <svg
          width="360"
          height="200"
          viewBox="0 0 360 200"
          xmlns="http://www.w3.org/2000/svg"
          className="my-12 shine"
        >
          <g>
            <path
              d="M332.5,130h-305c-2.8,0-5-2.2-5-5v0c0-2.8,2.2-5,5-5h305c2.8,0,5,2.2,5,5v0C337.5,127.8,335.3,130,332.5,130z"
              fill="#0d0d0d"
            />
            <path
              d="M351,153H9c-2.8,0-5-2.2-5-5l0,0c0-2.8,2.2-5,5-5h342c2.8,0,5,2.2,5,5l0,0C356,150.8,353.8,153,351,153z"
              fill="#0d0d0d"
            />
            <path
              d="M341.5,177h-323c-2.8,0-5-2.2-5-5l0,0c0-2.8,2.2-5,5-5h323c2.8,0,5,2.2,5,5l0,0C346.5,174.8,344.3,177,341.5,177z"
              fill="#0d0d0d"
            />
            <path
              d="M312,200H48c-2.8,0-5-2.2-5-5l0,0c0-2.8,2.2-5,5-5h264c2.8,0,5,2.2,5,5l0,0C317,197.8,314.8,200,312,200z"
              fill="#0d0d0d"
            />
            <path
              d="M286.5,37h-213C71,37,69,35,69,32.5v-28C69,2,71,0,73.5,0h213c2.5,0,4.5,2,4.5,4.5v28C291,35,289,37,286.5,37z"
              fill="#0d0d0d"
            />
            <path
              d="M355.5,91H4.5C2,91,0,89,0,86.5v-28C0,56,2,54,4.5,54h351c2.5,0,4.5,2,4.5,4.5v28C360,89,358,91,355.5,91z"
              fill="#0d0d0d"
            />
          </g>
        </svg>
      </div>
      <div className="lg:flex flex-col items-start justify-center hidden absolute left-12 top-1/3">
        <svg
          width="360"
          height="200"
          viewBox="0 0 360 200"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-8 shine"
        >
          <g>
            <g>
              <path
                d="M310,130H5c-2.8,0-5-2.2-5-5v0c0-2.8,2.2-5,5-5h305c2.8,0,5,2.2,5,5v0C315,127.8,312.8,130,310,130z"
                fill="#0d0d0d"
              />
              <path
                d="M347,153H5c-2.8,0-5-2.2-5-5l0,0c0-2.8,2.2-5,5-5h342c2.8,0,5,2.2,5,5l0,0C352,150.8,349.8,153,347,153z"
                fill="#0d0d0d"
              />
              <path
                d="M328,177H5c-2.8,0-5-2.2-5-5l0,0c0-2.8,2.2-5,5-5h323c2.8,0,5,2.2,5,5l0,0C333,174.8,330.8,177,328,177z"
                fill="#0d0d0d"
              />
              <path
                d="M269,200H5c-2.8,0-5-2.2-5-5l0,0c0-2.8,2.2-5,5-5h264c2.8,0,5,2.2,5,5l0,0C274,197.8,271.8,200,269,200z"
                fill="#0d0d0d"
              />
              <path
                d="M217.5,37H4.5C2,37,0,35,0,32.5v-28C0,2,2,0,4.5,0h213c2.5,0,4.5,2,4.5,4.5v28C222,35,220,37,217.5,37z"
                fill="#0d0d0d"
              />
              <path
                d="M355.5,91H4.5C2,91,0,89,0,86.5v-28C0,56,2,54,4.5,54h351c2.5,0,4.5,2,4.5,4.5v28C360,89,358,91,355.5,91z"
                fill="#0d0d0d"
              />
            </g>
          </g>
        </svg>
        <a className="animated-button ml-2" href="/" rel="noopener noreferrer">
          <p>Home</p>
          <span></span>
        </a>
      </div>
    </div>
  );
}
