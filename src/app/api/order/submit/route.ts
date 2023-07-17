import authOptions from "@/lib/auth";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

type ItemNotEnoughQtyType = {type: string, id: string | null, quantity: number}
type ItemQtyType = {id: string, quantity: number}
type PayloadType = {
    cart: {
      [key: string]: {
        id: string
        quantity: number
        price: number
        discount: number
      }
    },
    price: number
    discount: number
  }

export async function POST(request: Request) {
    const session: { email: string } | null = await getServerSession(authOptions);
    const payload: PayloadType = await request.json()

    if (!session) return NextResponse.json({'message': 'unAuthorized', 'status': 401})
    
    const user = await prisma.user.findUnique({
        where: {
            email: session.email
        }
    })

    if (!user) {
        return NextResponse.json({'message': 'user not found', 'status': 401})
    }

    // check if profile complete

    const cartItemsId: string[] = Object.values(payload.cart).map((item) => item.id);

    const itemsQtyList: ItemQtyType[] = await prisma.productLocation.findMany({
        where: {
            id: {
                in: cartItemsId
            }
        }
    })

    const itemWithNotEnoughQty: ItemNotEnoughQtyType = itemsQtyList.reduce((result: ItemNotEnoughQtyType, item: ItemQtyType) => {
        if (payload.cart[item.id].quantity > item.quantity) {
            return {type: 'lack', id: item.id, quantity: item.quantity}
        }

        return result
    }, {type: 'lack', id: null, quantity: -1})

    if (itemWithNotEnoughQty.id) return NextResponse.json(itemWithNotEnoughQty)

    itemsQtyList?.map(async (item) => {
        await prisma.productLocation.update({
            where: { id: item.id },
            data: {
                quantity: item.quantity - payload.cart[item.id].quantity
            }
        })
    })

    const order = await prisma.order.create({
        data: {
            price: payload.price,
            discount: payload.discount,  // coupon
            payment: 'CASH',
            shipping_cost: 0,
            client_id: user.id
        }
    })

    Object.values(payload.cart).map(async (item) => {
        await prisma.orderItem.create({
            data: {
                order_id: order.id,
                item_id: item.id,
                price: item.price,
                discount: item.discount,
                quantity: item.quantity
            }
        })
            .catch(err => {
                NextResponse.json({'orderItem.create error': err})
            })
    })

    return NextResponse.json(order);
}
