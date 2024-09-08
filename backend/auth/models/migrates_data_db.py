from documents import Plan , User
from db import engine
from beanie import init_beanie
import asyncio

async def main():
    await init_beanie(engine["auth_db"] , document_models=[User , Plan])
    plan_basic = Plan(type="basic" , unity_memory="MB" , limit_memory=500)
    plan_medium = Plan(type="medium" , unity_memory="GB" , limit_memory=1)
    plan_pro = Plan(type="pro" , unity_memory="GB" , limit_memory=10)
    await plan_basic.insert()
    await plan_medium.insert()
    await plan_pro.insert()
if __name__ == "__main__":
    asyncio.run(main())