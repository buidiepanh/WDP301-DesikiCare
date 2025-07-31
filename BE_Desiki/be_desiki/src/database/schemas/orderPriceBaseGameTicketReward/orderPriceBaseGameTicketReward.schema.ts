import { Schema, Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import mongoose, { Document, Model, model } from 'mongoose';
import { IsNumber, isNumber, IsString, isString } from 'class-validator';
import { apply_PostHooks, apply_PreHooks } from './orderPriceBaseGameTicketReward.hooks';
import { apply_Methods } from './orderPriceBaseGameTicketReward.methods';
import { apply_Statics } from './orderPriceBaseGameTicketReward.statics';
import { apply_Virtuals } from './orderPriceBaseGameTicketReward.virtuals';
import { apply_Indexes } from './orderPriceBaseGameTicketReward.indexes';


interface IOrderPriceBaseGameTicketReward_Statics {

}

interface IOrderPriceBaseGameTicketReward_Methods {

}

interface IOrderPriceBaseGameTicketReward_Virtuals {

}

export type OrderPriceBaseGameTicketRewardDocument = OrderPriceBaseGameTicketReward & Document & IOrderPriceBaseGameTicketReward_Methods & IOrderPriceBaseGameTicketReward_Virtuals;  



@Schema({ collection: 'orderPriceBaseGameTicketRewards', timestamps: true })
export class OrderPriceBaseGameTicketReward {
    @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
    _id?: mongoose.Types.ObjectId;

    @Prop({ type: Number, required: true, unique: true })
    orderPriceThreshold: number;

    @Prop({ type: Number, required: true })
    gameTicketReward: number;
}



type OrderPriceBaseGameTicketRewardModel = Model<OrderPriceBaseGameTicketRewardDocument> & IOrderPriceBaseGameTicketReward_Statics; 
const OrderPriceBaseGameTicketRewardSchema = SchemaFactory.createForClass(OrderPriceBaseGameTicketReward);

// Apply hooks
apply_PreHooks(OrderPriceBaseGameTicketRewardSchema);
apply_PostHooks(OrderPriceBaseGameTicketRewardSchema);

// Apply methods
apply_Methods(OrderPriceBaseGameTicketRewardSchema);

// Apply statics
apply_Statics(OrderPriceBaseGameTicketRewardSchema);

// Apply virtuals
apply_Virtuals(OrderPriceBaseGameTicketRewardSchema);

// Apply indexes
apply_Indexes(OrderPriceBaseGameTicketRewardSchema);

export {OrderPriceBaseGameTicketRewardSchema, OrderPriceBaseGameTicketRewardModel}
