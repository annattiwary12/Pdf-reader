import FileUploadComponent from "./components/file-upload";

export  default  function  Home (){
   return( <div>
     <div className="min-h-screen w-screen flex">
       <div className = "w-[40vw] min-h-screen p-4 flex  justify-center items-center">
          <FileUploadComponent/>
       </div>
   
        <div className="w-[60vw] min-h-screen border-l-2">2</div>


     </div>
   </div>
   );
}
