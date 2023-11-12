import path from "path"
import { fileURLToPath } from "url"
import passport from "passport"

export const passportCall = (strategy) => {
    return async(request, response, next)=>{
        passport.authenticate(strategy, function(err, user, info){
            if(err) return next(err)
            if(!user){
                return response.status(401).send({error:info.messages?info.messages:info.toString()})
            }
            request.user = user
            next()
        })(request, response, next)
    }
}
export const authorization= (role) => {
    return async(request, response, next)=>{
        if(!request.user) return response.status(401).send({error: "Unauthorized"})
        if(request.user.role!= role) return response.status(403).send({error:"No permissions"})
        next()
    }
}


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default __dirname