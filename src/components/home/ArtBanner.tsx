export default function ArtBanner () {
    return (
        <section className="py-4 md:py-8 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="relative bg-gradient-to-r from-pink-50 to-yellow-50 rounded-lg overflow-hidden h-48 md:h-64 flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-6 md:py-0">
            <img
              src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300"
              alt="Art"
              className="h-32 md:h-56 object-contain hidden md:block"
            />
            <div className="text-center">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-1 md:mb-2">
                Gear Up And Always 
              </h2>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                Art & Craft Making
              </h2>
            </div>
            <img
              src="https://images.unsplash.com/photo-1513705153412-e7e8faa06a78?w=300"
              alt="Pencils"
              className="h-32 md:h-56 object-contain hidden md:block"
            />
          </div>
        </div>
      </section>
    )
}