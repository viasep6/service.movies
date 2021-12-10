const { db, admin } = require('../service.shared/Repository/Firebase/admin')

exports.followMovie = async (request, response) => {

    console.log(request.body);
    const user = db.doc('users/' + request.user.idtoken)
    const movieId = request.body.movieId;


    const movieRef = db.doc('movies/' + movieId)
    const movieDoc = await movieRef.get() 

    if (!movieDoc.exists) {
        console.log("movie not exists");
        movieRef.set({
            title: request.body.title,
            followers: [user],
            followcount: admin.firestore.FieldValue.increment(1)
        })
        user.update({
            followCount: admin.firestore.FieldValue.increment(1)
        })
    } else {
        // movie exists, check if user is following, if not add, if then remove       
        const followers = movieDoc.data().followers?.map(x => x.id)

        if (followers != undefined && followers.includes(user.id)) {
            movieRef.update({
                followers: admin.firestore.FieldValue.arrayRemove(user),
                followCount: admin.firestore.FieldValue.increment(-1)
            })
            user.update({
                followCount: admin.firestore.FieldValue.increment(-1)
            })

        } else{
            movieRef.update({
                followers: admin.firestore.FieldValue.arrayUnion(user),
                followCount: admin.firestore.FieldValue.increment(1)
                
            })
            user.update({
                followCount: admin.firestore.FieldValue.increment(1)
            })
        }    
    }
}