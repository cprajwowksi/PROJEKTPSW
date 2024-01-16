import {useNavigate} from "react-router-dom";

function Posts() {
    const posty = [
        {
            user: {
            id: 1, name: "Patryk", role:'Wlasciciel', img: 'pandaimg'
            },
        date: '12:12:2023',
        message:'Dziękuje za rok 2023!!'
        }
        ,
        {
            user: {
                id: 1, name: "Patryk", role:'Wlasciciel', img: 'pandaimg'
            },
            date: '12:11:2023',
            message:'W naszym menu posiadamy autorskie rameny – shoyu ramen, tantanmen ramen, curry paitan ramen. Co miesiąc tworzymy inny, specjalny ramen o unikatowym smaku o którym informujemy na naszych mediach społecznościowych. Buliony są naszą autorska kompozycją, a dodatki do nich to najlepszej jakości składniki.!!'
        }
    ]

    return (
        <div className="posts">
            {posty.map(post => {
                return (
                    <div className="post">
                        <h2>{post.user.name} ({post.user.role})</h2>
                        <div className="post-body">
                            {post.message}
                        </div>
                        <div className="post-footer">
                            <i className="fa-regular fa-clock"></i>{post.date}
                        </div>
                        <div className="post-buttons">
                            <button className="edit-post post-button">
                                <i className="fa-solid fa-pen"></i>
                            </button>
                            <button className="delete-post post-button">
                                <i className="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                )
            })}
            <button className="add-post">
                DODAJ NOWY
            </button>
            <div className="post-form">
                <form>

                </form>
            </div>
        </div>
    );
}

export default Posts;
