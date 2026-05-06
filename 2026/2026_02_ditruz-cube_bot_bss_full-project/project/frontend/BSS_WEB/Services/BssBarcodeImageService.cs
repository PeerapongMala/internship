namespace BSS_WEB.Services
{
    using BSS_WEB.Core.Constants;
    using BSS_WEB.Interfaces;
    using Microsoft.Extensions.Caching.Memory;
    using SkiaSharp;
    using System;
    using System.Collections.Concurrent;
    using System.Threading;
    using System.Threading.Tasks;
    using ZXing;
    using ZXing.Common;
    using ZXing.SkiaSharp;
    using ZXing.SkiaSharp.Rendering;

    public class BssBarcodeImageService : IBssBarcodeImageService
    {
        private bool _pureBarcode = true;
        private BarcodeFormat _barcodeFormat;

        private int _width = BssBarcodeConstants.BarcodeWidth;
        private int _height = BssBarcodeConstants.BarcodeHeight;
        private int _margin = BssBarcodeConstants.BarcodeMargin;

        private IMemoryCache _cache;

        // จำกัดจำนวน concurrent generation
        private static readonly SemaphoreSlim _cpuLimiter =
            new(Environment.ProcessorCount, Environment.ProcessorCount);

        // ป้องกัน generate ซ้ำพร้อมกัน
        private static readonly ConcurrentDictionary<string, Task<string>> _inflight =
            new();

        #region Builder

        public class BssBarcodeImageServiceBuilder
        {
            private readonly BssBarcodeImageService _service = new();

            public BssBarcodeImageServiceBuilder SetWidth(int width)
            {
                _service._width = width;
                return this;
            }

            public BssBarcodeImageServiceBuilder SetHeight(int height)
            {
                _service._height = height;
                return this;
            }

            public BssBarcodeImageServiceBuilder SetMargin(int margin)
            {
                _service._margin = margin;
                return this;
            }

            public BssBarcodeImageServiceBuilder SetPureBarcode(bool pureBarcode)
            {
                _service._pureBarcode = pureBarcode;
                return this;
            }

            public BssBarcodeImageServiceBuilder SetBarcodeFormat(BarcodeFormat barcodeFormat)
            {
                _service._barcodeFormat = barcodeFormat;
                return this;
            }

            public BssBarcodeImageService Build(IMemoryCache cache)
            {
                _service._cache = cache;
                return _service;
            }
        }

        #endregion

        public BssBarcodeImageService()
        {
        }

        public BssBarcodeImageService(
            int width,
            int height,
            int margin,
            bool pureBarcode,
            BarcodeFormat barcodeFormat,
            IMemoryCache cache)
        {
            _width = width;
            _height = height;
            _margin = margin;
            _pureBarcode = pureBarcode;
            _barcodeFormat = barcodeFormat;
            _cache = cache;
        }

        public async Task<string> GenerateBarcodeImageAsync(string barcodeString)
        {
            if (string.IsNullOrWhiteSpace(barcodeString))
                return string.Empty;

            barcodeString = barcodeString.Trim();

            if (_cache.TryGetValue(barcodeString, out string cached))
                return cached;

            var task = _inflight.GetOrAdd(barcodeString, GenerateInternalAsync);

            try
            {
                return await task.ConfigureAwait(false);
            }
            finally
            {
                _inflight.TryRemove(barcodeString, out _);
            }
        }

        private async Task<string> GenerateInternalAsync(string barcodeString)
        {
            await _cpuLimiter.WaitAsync().ConfigureAwait(false);

            try
            {
                var writer = new BarcodeWriter<SKBitmap>
                {
                    Renderer = new SKBitmapRenderer(),
                    Format = _barcodeFormat,
                    Options = new EncodingOptions
                    {
                        Width = _width,
                        Height = _height,
                        Margin = _margin,
                        PureBarcode = _pureBarcode
                    }
                };

                using var bitmap = writer.Write(barcodeString);
                using var image = SKImage.FromBitmap(bitmap);
                using var data = image.Encode(SKEncodedImageFormat.Png, 100);

                var result =
                    "data:image/png;base64," +
                    Convert.ToBase64String(data.ToArray());

                _cache.Set(
                    barcodeString,
                    result,
                    new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30),
                        Size = 1
                    });

                return result;
            }
            catch
            {
                return string.Empty;
            }
            finally
            {
                _cpuLimiter.Release();
            }
        }
    }
}