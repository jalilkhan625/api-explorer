export default function ResponseViewer({ response }: { response: any }) {
  return (
    <div className="bg-gray-100 p-4 sm:p-6 md:p-8 rounded-lg mt-4 sm:mt-6 md:mt-8 w-full">
      {response.error ? (
        <div className="text-red-600 text-sm sm:text-base md:text-lg font-medium text-center sm:text-left">
          Error: {response.error}
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:gap-6">
          <div>
            <strong className="text-sm sm:text-base md:text-lg">Status:</strong>{' '}
            <span className="text-sm sm:text-base">{response.status}</span>
          </div>
          <div>
            <strong className="text-sm sm:text-base md:text-lg">Headers:</strong>
            <pre
              className="bg-white p-3 sm:p-4 rounded-lg text-xs sm:text-sm md:text-base mt-2 sm:mt-3 max-h-64 sm:max-h-80 overflow-auto"
            >
              {JSON.stringify(response.headers, null, 2)}
            </pre>
          </div>
          <div>
            <strong className="text-sm sm:text-base md:text-lg">Body:</strong>
            <pre
              className="bg-white p-3 sm:p-4 rounded-lg text-xs sm:text-sm md:text-base mt-2 sm:mt-3 max-h-64 sm:max-h-80 overflow-auto"
            >
              {JSON.stringify(response.body, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}