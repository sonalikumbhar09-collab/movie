let cl = console.log;

const backdrop = document.getElementById('backdrop')
const movieModal = document.getElementById('movieModal')
const addMovies = document.getElementById('addMovies')
const onToggle = document.querySelectorAll('.onToggle')
const movieForm = document.getElementById('movieForm')
const movieNameControl = document.getElementById('movieName')
const movieImgControl = document.getElementById('movieImg')
const MovieDescriptionControl = document.getElementById('MovieDescription')
const movieRatingControl = document.getElementById('movieRating')
const moviecontainer = document.getElementById('moviecontainer')
const addMovie = document.getElementById('addMovie')
const updateMovie = document.getElementById('updateMovie')



uuid = () => {
    return (
        String('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx')
    ).replace(/[xy]/g, (character) => {
        const random = (Math.random() * 16) | 0;
        const value = character === "x" ? random : (random & 0x3) | 0x8;
        return value.toString(16);
    });
}


const onAddMovieModal = (eve)=>{
    backdrop.classList.toggle('active')
    movieModal.classList.toggle('active')

    movieForm.reset()
    addMovie.classList.remove('d-none')
    updateMovie.classList.add('d-none')
}
addMovies.addEventListener('click', onAddMovieModal)
onToggle.forEach(f=>f.addEventListener('click', onAddMovieModal))


let movieArr = JSON.parse(localStorage.getItem('movieArr')) || 
[
 {
        movieDescription:"Shivaji's death sparks the Maratha-Mughal conflict. His son Sambhaji leads resistance against Aurangzeb's forces. Amid battles and intrigue, both sides face challenges in a struggle for power.",
movieImg:"https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcR0IfyAU2VKhi9idE-H29QfleuY1PmgTbmoKsk9ixU-GtYxSSLL8IUKA2wZ6x6ubTEwg7iQ",
movieName:"Chhaava",
movieRating:"2",
movieId : uuid()
    }
]

const onRating =(r)=>{
    if(r>=4){
        return 'badge-success'
    }else if(r>=3 && r<=4){
        return 'badge-warning'
    }else{
        return 'badge-danger'
    }
}


const snackBar = (msg, icon)=>{
    Swal.fire({
        title:msg,
        icon:icon,
        timer:1500
    })
}

const onClickEdit = (ele)=>{
    let Get_Id = ele.closest('.card').id;
    cl(Get_Id)
    localStorage.setItem('Get_Id', Get_Id)
    let Edit_Obj = movieArr.find(f=>f.movieId == Get_Id)
    cl(Edit_Obj)
    movieForm.reset()
    onAddMovieModal();
    movieNameControl.value = Edit_Obj.movieName;
    movieImgControl.value = Edit_Obj.movieImg;
    MovieDescriptionControl.value = Edit_Obj.movieDescription;
    movieRatingControl.value = Edit_Obj.movieRating;

    localStorage.setItem('movieArr', JSON.stringify(movieArr))

    addMovie.classList.add('d-none')
    updateMovie.classList.remove('d-none')
}

const onClickRemove =(ele)=>{
    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {

     let remove_Id=ele.closest('.card').id
    cl(remove_Id)
    let get_Index = movieArr.findIndex(f=>f.movieId == remove_Id)
    cl(get_Index)
    movieArr.splice(get_Index, 1);
    ele.closest('.col-md-3').remove()
    localStorage.setItem('movieArr', JSON.stringify(movieArr))

    Swal.fire({
      title: "Deleted!",
      text: `Your file ${remove_Id} has been deleted.`,
      icon: "success",
      timer:2000
    });
  }
});

}

const movieTemplating = (f)=>{
    let result = ``;
    f.forEach(f=>
        result += `
                    <div class="col-md-3">
                <div class="card mt-2" id=${f.movieId}>
                    <div class="card-header d-flex justify-content-between">
                        <div class="col-md-10">
                            <h4>${f.movieName}</h4>
                        </div>
                        <div class="col-md-2 text-align"><span class="badge ${onRating(f.movieRating)}">${f.movieRating}</span></div>
                    </div>
                    <div class="card-body pt-0 pb-2">
                        <div class="content">
                            <img src="${f.movieImg}"
                            alt="${f.movieName}"
                            title="${f.movieName}">
                            <p><strong>${f.movieName}</strong>
                                ${f.movieDescription}
                            </p>
                        </div>
                    </div>
                    <div class="card-footer d-flex justify-content-between p-2">
                        <button onclick="onClickEdit(this)" class="btn sm-btn nfx-sec-btn ">Edit</button>
                        <button onclick = "onClickRemove(this)"  class="btn sm-btn nfx-pri-btn">Remove</button>
                    </div>
                </div>
            </div>
        `
    )
    moviecontainer.innerHTML = result;
}

movieTemplating(movieArr)

const onSubmitForm = (eve)=>{
    eve.preventDefault();
    // cl('submitted!!!')
    let Obj = {
        movieName:movieNameControl.value,
        movieImg : movieImgControl.value,
        movieDescription : MovieDescriptionControl.value,
        movieRating : movieRatingControl.value,
        movieId : uuid()
    }
    cl(Obj)
    movieForm.reset()
    movieArr.unshift(Obj)
    onAddMovieModal()
    localStorage.setItem('movieArr', JSON.stringify(movieArr))
    movieTemplating(movieArr)

    snackBar(`The ${Obj.movieName} is Add Successfully!!!`, 'success')

}

movieForm.addEventListener('submit', onSubmitForm)

const onUpdateMovie = (eve)=>{
    let update_Id = localStorage.getItem('Get_Id')
    cl(update_Id)
    let updated_Obj ={
        movieName:movieNameControl.value,
        movieImg : movieImgControl.value,
        movieDescription : MovieDescriptionControl.value,
        movieRating : movieRatingControl.value,
        movieId : update_Id
    }
    cl(updated_Obj)
    onAddMovieModal()
    let get_Index = movieArr.findIndex(f=>f.movieId == update_Id)
    cl(get_Index)
    movieArr[get_Index] = updated_Obj;
    localStorage.setItem('movieArr', JSON.stringify(movieArr))
    movieTemplating(movieArr)
    snackBar(`The ${updated_Obj.movieName} is Updated Successfully!!!`, 'success')
}

updateMovie.addEventListener('click', onUpdateMovie)
