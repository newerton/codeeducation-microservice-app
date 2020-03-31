import Toastr from 'toastr2';

const toast = new Toastr();
toast.options.progressBar = true;
toast.options.newestOnTop = true;

export default toast;
