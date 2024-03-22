import { Button } from "flowbite-react";

export default function CallToAction(props) {
  return (
    <div className="h-52 flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">Want to start fast?</h2>
        <p className="text-gray-500 my-2">Checkout this website</p>
        <Button
          gradientDuoTone="purpleToPink"
          className="rounded-tl-xl rounded-bl-none w-1/3 self-center"
        >
          <a
            href="https://www.binance.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Binance
          </a>
        </Button>
      </div>
      <div className="p-6 flex-1 mx-auto">
        <img
          className="max-w-xs"
          src="https://public.bnbstatic.com/image/cms/blog/20231121/4f58a31c-9a3d-4476-bfe5-f8807b93903b.png"
        />
      </div>
    </div>
  );
}
