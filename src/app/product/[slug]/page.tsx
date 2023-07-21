import Detail from '@/components/product/details'
import Options from '@/components/product/options'
import prisma from '@/lib/prisma'

import Image from "next/legacy/image"
import { Product } from '@prisma/client'

const getProduct = async (slug: string) => {
    return await prisma.product.findUnique(
        {
            where: {
                id: slug
            },
            include: {
                productLocation: {
                    where: {
                        public: {
                            equals: true
                        },
                        quantity: {
                            gt: 0
                        }
                    },
                    include: {
                        color: {
                            select: {
                                color: true
                            }
                        },
                        size: {
                            select: {
                                size: true
                            }
                        }
                    }
                },
                gallery: {
                    select: {
                        src: true,
                        alt: true
                    }
                }
            }
        }
    )
        .then((res: Product | null) => {
            return JSON.parse(JSON.stringify(res))
        })
}

export const generateMetadata = async (
    { params }: { params: { slug: string } }
) => {
    const product = await getProduct(params.slug)

    return {
        title: (product?.title || 'محصولی یافت نشد!') + ' | فروشگاه اینترنتی'
    }
}

const Product = async ({ params }: { params: { slug: string } }) => {
    const product = await getProduct(params.slug)

    return (
        <>
            {
                product?.productLocation.length ?
                    <Options product={product}>
                        <Detail product={product} />
                    </Options>
                    :
                    <div className='space-y-10 m-10'>
                        <div className='flex justify-center'>
                            <Image
                                className='object-contain'
                                src='/empty-cart.png'
                                alt='empty cart'
                                width='300'
                                height='300'
                            />
                        </div>
                        <h1 style={{ fontSize: '1.5rem' }} className='text-center'>
                            این محصول در حال حاضر در دسترس نمی‌باشد
                        </h1>
                        <div className='flex'>
                            <svg width="646" height="244" viewBox="0 0 646 244" fill="none">
                                <path d="M296.438 179.499C297.299 177.007 298.637 173.763 300.872 170.29C301.981 168.548 303.309 166.752 304.839 164.947C306.396 163.16 308.155 161.373 310.125 159.641C314.092 156.205 318.92 153.034 324.417 150.505C329.914 147.985 336.079 146.097 342.621 145.153C355.877 143.229 369.784 145.886 382.243 150.367C394.749 154.885 405.898 161.135 415.389 166.816C426.374 173.433 436.909 180.461 447.839 186.629C458.741 192.787 470.074 198.111 481.983 201.034C487.929 202.482 493.985 203.38 500.095 203.499C506.197 203.646 512.326 203.133 518.354 202.051C530.42 199.834 542.064 195.288 552.773 189.13C563.474 182.945 573.35 175.238 582.026 166.367C586.368 161.941 590.436 157.231 594.192 152.292C595.135 151.064 596.024 149.79 596.94 148.544L599.551 144.667C600.403 143.357 601.329 142.111 602.116 140.754L604.553 136.759L605.772 134.761L606.908 132.709L609.18 128.612C610.655 125.863 612.029 123.041 613.44 120.255C614.732 117.405 616.106 114.592 617.333 111.705C618.534 108.809 619.825 105.95 620.925 103.009C625.524 91.3248 629.399 79.3385 632.871 67.2147C637.259 52.0761 643.361 25.8492 645.266 26.8481C646.247 27.3704 646.027 32.0898 644.689 40.044C643.343 47.989 640.942 59.1964 637.085 72.5481C634.74 80.6214 632.221 88.6673 629.335 96.594C626.467 104.53 623.353 112.392 619.734 120.053C616.133 127.714 612.231 135.256 607.696 142.431C607.137 143.33 606.615 144.255 606.019 145.135L604.242 147.774C603.042 149.524 601.924 151.32 600.641 153.025C598.159 156.489 595.502 159.815 592.726 163.041C581.613 175.907 568.366 186.968 553.479 195.206C538.619 203.417 521.945 208.75 504.823 209.318C498.584 209.529 492.299 209.135 486.133 208.008C479.968 206.917 473.949 205.185 468.131 203.014C456.469 198.661 445.649 192.622 435.205 186.29C424.743 179.948 414.638 173.231 404.13 167.385C393.649 161.529 382.747 156.415 371.305 153.428C365.597 151.934 359.761 151 353.907 150.771C348.108 150.496 342.3 151.201 336.675 152.677C331.059 154.161 325.645 156.461 320.734 159.513C315.833 162.564 311.417 166.404 307.981 170.949C304.537 175.476 302.109 180.727 301.092 186.262C300.029 191.797 300.497 197.561 302.081 203.014C302.246 203.71 302.503 204.37 302.741 205.039L303.474 207.046L304.363 208.998L304.802 209.969L305.315 210.913L306.351 212.791C306.717 213.405 307.129 213.992 307.514 214.597C308.256 215.825 309.172 216.933 310.034 218.088C313.606 222.597 318.05 226.4 322.942 229.36C324.05 230.019 325.205 230.578 326.332 231.192C327.523 231.706 328.686 232.274 329.895 232.741C332.314 233.667 334.788 234.491 337.325 235.059C342.392 236.269 347.623 236.801 352.872 236.736C358.122 236.645 363.371 235.985 368.52 234.83C371.094 234.271 373.641 233.538 376.151 232.732C377.415 232.338 378.643 231.852 379.889 231.421C381.107 230.917 382.317 230.377 383.535 229.854C393.228 225.648 402.151 219.664 409.883 212.406C417.643 205.158 424.102 196.553 429.15 187.215C434.179 177.868 437.725 167.724 439.456 157.277C441.188 146.839 441.096 136.108 438.934 125.735C434.665 104.97 423.176 85.799 407.245 71.8333C399.751 65.2812 391.249 59.8837 382.088 56.0715L375.107 53.5056L371.515 52.4976L369.72 51.9936C369.124 51.8195 368.52 51.6546 367.906 51.5446C363.05 50.4724 358.131 49.6019 353.156 49.217C343.207 48.3372 333.139 48.7679 323.162 50.0967C313.185 51.4255 303.309 53.6981 293.552 56.4381C274.029 61.918 255.111 69.6981 235.744 76.6718C226.06 80.1632 216.258 83.4805 206.254 86.2389C196.249 89.0063 186.025 91.2148 175.609 92.3695C166.64 93.3775 157.533 93.7257 148.418 92.8735C139.33 92.0396 130.232 89.9869 121.722 86.2755C113.211 82.6008 105.396 76.9559 99.322 69.8356C93.2205 62.7428 88.878 53.8997 87.6046 44.4243C86.945 39.6499 87.2473 34.7839 88.31 30.147C89.3727 25.501 91.2142 21.029 93.7702 16.9878C96.3079 12.9374 99.6426 9.33598 103.628 6.55934L105.139 5.54216C105.643 5.2031 106.193 4.94651 106.724 4.6441C107.265 4.36002 107.787 4.05762 108.337 3.7827L110.022 3.06792C112.267 2.10572 114.713 1.51924 117.132 1.16185C122.006 0.47456 126.934 1.11603 131.506 2.62806C136.077 4.16758 140.347 6.65098 143.874 10.0233C147.401 13.3864 150.067 17.8034 151.258 22.651C152.522 27.4254 152.266 32.5296 150.836 37.2032C149.508 41.6293 147.016 45.7989 143.92 49.4644C140.823 53.1574 137.085 56.3556 133.073 59.1506C129.06 61.9547 124.717 64.3098 120.274 66.3075C118.048 67.3064 115.785 68.1861 113.504 68.9742C111.213 69.7898 108.941 70.4038 106.724 71.0361C99.3495 73.1254 89.3636 75.398 79.2586 76.7818C69.1536 78.2205 58.9661 78.7703 51.3805 78.7153C50.5652 78.7153 49.7406 78.7153 48.9161 78.7153C48.0916 78.6879 47.2671 78.6695 46.4334 78.642C44.7752 78.5871 43.117 78.5321 41.4588 78.4863C38.1515 78.2846 34.8534 78.1564 31.6561 77.8814C27.9824 77.6615 24.6568 77.2308 21.6702 76.9009C18.6836 76.4794 16.036 76.0762 13.709 75.6546C11.3912 75.1964 9.40314 74.7749 7.72661 74.39C6.05924 73.9685 4.70336 73.5653 3.65896 73.2262C-0.536948 71.8425 0.186794 71.2102 5.19806 71.1002C6.29743 71.0727 6.2791 70.7611 6.85627 70.6054C7.14027 70.5229 7.57085 70.4862 8.36789 70.532C9.16493 70.5595 10.3193 70.6603 12.0508 70.8894C12.3348 70.9261 12.912 70.9994 13.1685 71.0361C23.6857 72.2182 34.3221 73.0613 45.0684 73.2629C55.8055 73.4553 66.68 73.0704 77.4538 71.5309C84.0775 70.6603 90.6279 69.3316 97.1233 67.8195L101.979 66.6008C103.591 66.1792 105.185 65.6844 106.798 65.2354C110.041 64.3556 113.082 63.2926 116.133 62.0555C122.189 59.5629 127.997 56.3923 133.091 52.4152C138.175 48.4655 142.582 43.5904 144.964 37.918C145.559 36.5067 145.981 35.0405 146.311 33.5652C146.567 32.0806 146.778 30.5777 146.732 29.0657C146.75 28.3143 146.659 27.5537 146.613 26.8022C146.485 26.06 146.448 25.2719 146.228 24.5754C146.027 23.8607 145.908 23.1184 145.651 22.4219L144.827 20.3417C142.206 14.9351 137.195 10.7289 131.478 8.41044C125.725 6.18363 119.202 5.70711 113.485 7.71399C107.723 9.77585 102.684 13.8721 99.2121 19.0955C95.7582 24.3097 93.5595 30.4769 93.193 36.7542C92.7533 42.9947 94.1275 49.3636 96.8393 55.1185C98.186 58.0051 99.8442 60.7542 101.75 63.3293C103.683 65.886 105.863 68.2686 108.227 70.4496C112.954 74.8482 118.488 78.2755 124.452 80.8414C130.407 83.4347 136.792 85.0659 143.269 86.0739C149.765 87.0636 156.379 87.3385 162.994 87.1369C169.617 86.862 176.232 86.193 182.8 85.1484C189.36 84.0304 195.883 82.61 202.351 80.9055C218.209 76.6718 233.719 70.9352 249.266 65.1712C257.044 62.2846 264.831 59.3797 272.738 56.6763C280.635 53.973 288.633 51.4896 296.74 49.3728C304.848 47.2651 313.075 45.4965 321.43 44.351C329.776 43.2147 338.241 42.6557 346.707 42.9306C355.172 43.2055 363.655 44.3327 371.9 46.4862L374.979 47.3476C376.005 47.6408 377.04 47.8974 378.038 48.2914L384.067 50.4907C386.018 51.3613 387.951 52.2685 389.893 53.1574C390.379 53.3865 390.864 53.5973 391.341 53.8447L392.733 54.6236L395.527 56.1907C411.688 65.5469 425.394 79.2927 434.408 96.035L434.243 95.7509C439.044 104.411 442.663 113.758 444.77 123.481C446.895 133.194 447.445 143.293 446.336 153.19C444.257 171.93 436.653 190.047 425.009 205.094C419.145 212.59 412.265 219.316 404.561 224.961C402.71 226.473 400.63 227.664 398.633 228.975L397.122 229.946C396.627 230.276 396.114 230.597 395.582 230.862L392.422 232.558C391.368 233.117 390.324 233.703 389.252 234.226L385.963 235.655L382.674 237.076C381.566 237.525 380.43 237.9 379.312 238.313C370.279 241.401 360.751 243.096 351.177 243.005C341.622 242.913 331.984 240.915 323.354 236.663C314.651 232.365 307.386 225.685 302.21 217.721C297.061 209.776 294.01 200.292 294.459 190.752C294.487 190.001 294.587 189.195 294.661 188.324C294.743 187.453 294.798 186.528 294.981 185.584C295.064 185.107 295.146 184.622 295.229 184.118C295.339 183.623 295.458 183.128 295.577 182.615C295.76 181.579 296.127 180.562 296.438 179.499Z" fill="gray" />
                            </svg>
                        </div>
                    </div>
            }
        </>
    );
}

export default Product;