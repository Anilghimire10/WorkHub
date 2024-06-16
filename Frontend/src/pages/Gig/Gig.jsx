import React from "react";
import "./gig.scss";
import { Slider } from "infinite-react-carousel/lib";

function Gig() {
  return (
    <div className="gig">
      <div className="container">
        <div className="left">
          <span className="breadcrumbs">Liverr : Graphics & Design :</span>
          <h1>I will create ai generated art for you</h1>
          <div className="user">
            <img className="pp" src="/img/userprof.avif" alt="" />
            <span>Rajiv Parajuli</span>
            <div className="stars">
              <img src="/img/star.png" alt="" />
              <img src="/img/star.png" alt="" />
              <img src="/img/star.png" alt="" />
              <img src="/img/star.png" alt="" />
              <img src="/img/star.png" alt="" />
              <span>5</span>
            </div>
          </div>
          <Slider slidesToShow={1} arrowsScroll={1} className="slider">
            <img src="/img/design1.png" alt="" />
            <img src="/img/design2.png" alt="" />
            <img src="/img/design3.png" alt="" />
          </Slider>
          <h2>About This Gig</h2>
          <p>
            I use an AI program to create images based on text prompts. This
            means I can help you to create a vision you have through a textual
            description of your scene without requiring any reference images.
            Some things I've found it often excels at are: Character portraits
            (E.g. a picture to go with your DnD character) Landscapes (E.g.
            wallpapers, illustrations to compliment a story) Logos (E.g. Esports
            team, business, profile picture) You can be as vague or as
            descriptive as you want. Being more vague will allow the AI to be
            more creative which can sometimes result in some amazing images. You
            can also be incredibly precise if you have a clear image of what you
            want in mind. All of the images I create are original and will be
            found nowhere else. If you have any questions you're more than
            welcome to send me a message.
          </p>
          <div className="seller">
            <h2>About The Seller</h2>
            <div className="user">
              <img src="/img/userprof.avif" alt="" />
              <div className="info">
                <span>Rajiv Parajuli</span>
                <div className="stars">
                  <img src="/img/star.png" alt="" />
                  <img src="/img/star.png" alt="" />
                  <img src="/img/star.png" alt="" />
                  <img src="/img/star.png" alt="" />
                  <img src="/img/star.png" alt="" />
                  <span>5</span>
                </div>
                <button>Contact Me</button>
              </div>
            </div>
            <div className="box">
              <div className="items">
                <div className="item">
                  <span className="title">From</span>
                  <span className="desc">PKR</span>
                </div>
                <div className="item">
                  <span className="title">Member since</span>
                  <span className="desc">Apr 2023</span>
                </div>
                <div className="item">
                  <span className="title">Avg. response time</span>
                  <span className="desc">6 hours</span>
                </div>
                <div className="item">
                  <span className="title">Last delivery</span>
                  <span className="desc">5 day</span>
                </div>
                <div className="item">
                  <span className="title">Languages</span>
                  <span className="desc">Englis, Nepali</span>
                </div>
              </div>
              <hr />
              <p>
                My name is Rajiv, I enjoy creating AI generated art in my spare
                time. I have a lot of experience using the AI program and that
                means I know what to prompt the AI with to get a great and
                incredibly detailed result.
              </p>
            </div>
          </div>
          <div className="reviews">
            <h2>Reviews</h2>
            <div className="item">
              <div className="user">
                <img
                  className="pp"
                  src="https://scontent.fpkr1-1.fna.fbcdn.net/v/t39.30808-1/347248268_176425111786619_2091177235393677739_n.jpg?stp=c0.155.480.480a_dst-jpg_p480x480&_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gbiKtLNo5jcQ7kNvgEozlQh&_nc_ht=scontent.fpkr1-1.fna&oh=00_AfA4KuLr9x0fPI7UhXZBSHGzAg7BPqYiaN1nmVYO8StVzg&oe=6637E84C"
                  alt=""
                />
                <div className="info">
                  <span>Anil Ghimire</span>
                  <div className="country">
                    <img src="/img/nepal.png" alt="" />
                    <span>Nepal</span>
                  </div>
                </div>
              </div>
              <div className="stars">
                <img src="/img/star.png" alt="" />
                <img src="/img/star.png" alt="" />
                <img src="/img/star.png" alt="" />
                <img src="/img/star.png" alt="" />
                <img src="/img/star.png" alt="" />
                <span>5</span>
              </div>
              <p>
                I just want to say that art_with_ai was the first, and after
                this, the only artist Ill be using on Fiverr. Communication was
                amazing, each and every day he sent me images that I was free to
                request changes to. They listened, understood, and delivered
                above and beyond my expectations. I absolutely recommend this
                gig, and know already that Ill be using it again very very soon
              </p>
              <div className="helpful">
                <span>Helpful?</span>
                <img src="/img/like.png" alt="" />
                <span>Yes</span>
                <img src="/img/dislike.png" alt="" />
                <span>No</span>
              </div>
            </div>
            <hr />
            <div className="item">
              <div className="user">
                <img
                  className="pp"
                  src="https://scontent.fpkr1-1.fna.fbcdn.net/v/t39.30808-1/277527623_489914599343359_1167191650294025702_n.jpg?stp=dst-jpg_s480x480&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=GChw1WOBNysQ7kNvgE7of2H&_nc_ht=scontent.fpkr1-1.fna&oh=00_AfCUCDWiCZrwE_5Orc1ZBGes-z0nMklVwImFEbv3TxZreA&oe=663802FE"
                  alt=""
                />
                <div className="info">
                  <span>Krishna KC</span>
                  <div className="country">
                    <img src="/img/nepal.png" alt="" />
                    <span>Nepal</span>
                  </div>
                </div>
              </div>
              <div className="stars">
                <img src="/img/star.png" alt="" />
                <img src="/img/star.png" alt="" />
                <img src="/img/star.png" alt="" />
                <img src="/img/star.png" alt="" />
                <img src="/img/star.png" alt="" />
                <span>5</span>
              </div>
              <p>
                The designer took my photo for my book cover to the next level!
                Professionalism and ease of working with designer along with
                punctuality is above industry standards!! Whatever your project
                is, you need this designer!
              </p>
              <div className="helpful">
                <span>Helpful?</span>
                <img src="/img/like.png" alt="" />
                <span>Yes</span>
                <img src="/img/dislike.png" alt="" />
                <span>No</span>
              </div>
            </div>
            <hr />
            <div className="item">
              <div className="user">
                <img
                  className="pp"
                  src="https://scontent.fpkr1-1.fna.fbcdn.net/v/t39.30808-6/366352220_1022993995373232_6700271882577390902_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_ohc=r_EF4Mr48N4Q7kNvgFpY4RB&_nc_ht=scontent.fpkr1-1.fna&oh=00_AfCUTfoRkwh23Oh20EtEf2d5JIadlaRhywrn_4ZuJZ683g&oe=6637D488"
                  alt=""
                />
                <div className="info">
                  <span>Biswash Bastola</span>
                  <div className="country">
                    <img src="/img/nepal.png" alt="" />
                    <span>Nepal</span>
                  </div>
                </div>
              </div>
              <div className="stars">
                <img src="/img/star.png" alt="" />
                <img src="/img/star.png" alt="" />
                <img src="/img/star.png" alt="" />
                <img src="/img/star.png" alt="" />
                <img src="/img/star.png" alt="" />
                <span>5</span>
              </div>
              <p>
                Amazing work! Communication was amazing, each and every day he
                sent me images that I was free to request changes to. They
                listened, understood, and delivered above and beyond my
                expectations. I absolutely recommend this gig, and know already
                that Ill be using it again very very soon
              </p>
              <div className="helpful">
                <span>Helpful?</span>
                <img src="/img/like.png" alt="" />
                <span>Yes</span>
                <img src="/img/dislike.png" alt="" />
                <span>No</span>
              </div>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="price">
            <h3>1 AI generated image</h3>
            <h2>$ 59.99</h2>
          </div>
          <p>
            I will create a unique high quality AI generated image based on a
            description that you give me
          </p>
          <div className="details">
            <div className="item">
              <img src="/img/clock.png" alt="" />
              <span>2 Days Delivery</span>
            </div>
            <div className="item">
              <img src="/img/recycle.png" alt="" />
              <span>3 Revisions</span>
            </div>
          </div>
          <div className="features">
            <div className="item">
              <img src="/img/greencheck.png" alt="" />
              <span>Prompt writing</span>
            </div>
            <div className="item">
              <img src="/img/greencheck.png" alt="" />
              <span>Artwork delivery</span>
            </div>
            <div className="item">
              <img src="/img/greencheck.png" alt="" />
              <span>Image upscaling</span>
            </div>
            <div className="item">
              <img src="/img/greencheck.png" alt="" />
              <span>Additional design</span>
            </div>
          </div>
          <button>Continue</button>
        </div>
      </div>
    </div>
  );
}

export default Gig;
